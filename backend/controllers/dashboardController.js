const Mission = require("../models/Mission");
const Configuration = require("../models/Configuration");

// GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    // 1. Récupération de la configuration
    let configuration = await Configuration.findOne();

    // Si aucune configuration n'existe encore, on la crée
    if (!configuration) {
      configuration = await Configuration.create({
        seuil_heures: 507,
        heures_par_jour: 8,
      });
    }

    const seuilHeures = configuration.seuil_heures;
    const heuresParJour = configuration.heures_par_jour;

    // 2. Date actuelle et début de la fenêtre des 12 mois glissants
    const dateFin = new Date();

    const dateDebut = new Date(dateFin);
    dateDebut.setFullYear(dateDebut.getFullYear() - 1);

    // 3. Missions confirmées ou terminées
    // On considère une mission si elle chevauche les 12 derniers mois.
    const missions = await Mission.find({
      statut: {
        $in: ["confirmee", "terminee"],
      },

      date_debut: {
        $lte: dateFin,
      },

      date_fin: {
        $gte: dateDebut,
      },
    });

    // -------------------------------
    // INTERMITTENCE
    // -------------------------------

    const missionsIntermittence = missions.filter(
      (mission) => mission.type === "intermittence"
    );

    const totalHeuresIntermittence =
      missionsIntermittence.reduce(
        (total, mission) => total + (mission.heures || 0),
        0
      );

    const pourcentageSeuil =
      seuilHeures > 0
        ? Math.round(
            (totalHeuresIntermittence / seuilHeures) * 100
          )
        : 0;

    const heuresRestantes = Math.max(
      seuilHeures - totalHeuresIntermittence,
      0
    );

    // -------------------------------
    // FREELANCE
    // -------------------------------

    const missionsFreelance = missions.filter(
      (mission) => mission.type === "freelance"
    );

    // CA freelance par mois
    const caParMois = {};

    missionsFreelance.forEach((mission) => {
      const date = new Date(mission.date_debut);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!caParMois[key]) {
        caParMois[key] = 0;
      }

      caParMois[key] += mission.montant_ht || 0;
    });

    // -------------------------------
    // RÉPARTITION DU TEMPS
    // -------------------------------

    const totalJoursFreelance =
      missionsFreelance.reduce(
        (total, mission) =>
          total + (mission.nombre_jours || 0),
        0
      );

    const heuresFreelance =
      totalJoursFreelance * heuresParJour;

    const tempsTotal =
      totalHeuresIntermittence + heuresFreelance;

    let pourcentageIntermittence = 0;
    let pourcentageFreelance = 0;

    if (tempsTotal > 0) {
      pourcentageIntermittence = Math.round(
        (totalHeuresIntermittence / tempsTotal) * 100
      );

      pourcentageFreelance =
        100 - pourcentageIntermittence;
    }

    // 4. Réponse
    res.status(200).json({
      periode: {
        debut: dateDebut,
        fin: dateFin,
      },

      intermittence: {
        heures: totalHeuresIntermittence,
        seuil: seuilHeures,
        progression: pourcentageSeuil,
        heures_restantes: heuresRestantes,
      },

      freelance: {
        ca_par_mois: caParMois,
      },

      repartition_temps: {
        intermittence: pourcentageIntermittence,
        freelance: pourcentageFreelance,
      },

      configuration: {
        heures_par_jour: heuresParJour,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération du tableau de bord",
      error: error.message,
    });
  }
};

// PATCH /api/dashboard/configuration
exports.updateConfiguration = async (req, res) => {
  try {
    let configuration = await Configuration.findOne();

    if (!configuration) {
      configuration = await Configuration.create({
        seuil_heures: 507,
        heures_par_jour: 8,
      });
    }

    if (req.body.seuil_heures !== undefined) {
      const seuilHeures = Number(req.body.seuil_heures);

      if (!Number.isFinite(seuilHeures) || seuilHeures < 0) {
        return res.status(400).json({
          message: "Le seuil d'heures est invalide",
        });
      }

      configuration.seuil_heures = seuilHeures;
    }

    if (req.body.heures_par_jour !== undefined) {
      const heuresParJour = Number(req.body.heures_par_jour);

      if (!Number.isFinite(heuresParJour) || heuresParJour <= 0) {
        return res.status(400).json({
          message: "Le nombre d'heures par jour est invalide",
        });
      }

      configuration.heures_par_jour = heuresParJour;
    }

    await configuration.save();

    res.status(200).json({
      message: "Configuration mise à jour",
      configuration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la configuration",
      error: error.message,
    });
  }
};