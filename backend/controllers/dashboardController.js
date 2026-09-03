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

    // Récupérer les valeurs
    const seuilHeures = configuration.seuil_heures;
    const heuresParJour = configuration.heures_par_jour;

    // 2. Date actuelle et début de la fenêtre des 12 mois glissants
    const dateFin = new Date();

    const dateDebut = new Date(dateFin);

    // Retirer un an
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

    // Filtrer les missions intermittentes
    const missionsIntermittence = missions.filter(
      (mission) => mission.type === "intermittence"
    );

    // Calculer le total des heures
    const totalHeuresIntermittence =
      missionsIntermittence.reduce(
        (total, mission) => total + (mission.heures || 0),
        0
      );

    // Calculer la progression
    const pourcentageSeuil =
      seuilHeures > 0
        ? Math.round(
            (totalHeuresIntermittence / seuilHeures) * 100
          )
        : 0;

    // Calculer les heures restantes
    const heuresRestantes = Math.max(
      seuilHeures - totalHeuresIntermittence,
      0
    );

    // -------------------------------
    // FREELANCE
    // -------------------------------

    // Filtrer les missions freelance
    const missionsFreelance = missions.filter(
      (mission) => mission.type === "freelance"
    );

    // CA freelance par mois
    const caParMois = {};

    // Classer le CA par mois
    missionsFreelance.forEach((mission) => {
      const date = new Date(mission.date_debut);

      // Créer la clé année-mois
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      // Créer le mois si nécessaire
      if (!caParMois[key]) {
        caParMois[key] = 0;
      }

      // Ajouter le montant
      caParMois[key] += mission.montant_ht || 0;
    });

    // -------------------------------
    // RÉPARTITION DU TEMPS
    // -------------------------------

    // Calculer les jours freelance
    const totalJoursFreelance =
      missionsFreelance.reduce(
        (total, mission) =>
          total + (mission.nombre_jours || 0),
        0
      );

    // Convertir les jours en heures
    const heuresFreelance =
      totalJoursFreelance * heuresParJour;

    // Calculer le temps total
    const tempsTotal =
      totalHeuresIntermittence + heuresFreelance;

    // Pourcentages par défaut
    let pourcentageIntermittence = 0;
    let pourcentageFreelance = 0;

    // Calculer les pourcentages
    if (tempsTotal > 0) {
      pourcentageIntermittence = Math.round(
        (totalHeuresIntermittence / tempsTotal) * 100
      );

      pourcentageFreelance =
        100 - pourcentageIntermittence;
    }

    // 4. Réponse
    res.status(200).json({
      // Période des 12 mois
      periode: {
        debut: dateDebut,
        fin: dateFin,
      },

      // Données d'intermittence
      intermittence: {
        heures: totalHeuresIntermittence,
        seuil: seuilHeures,
        progression: pourcentageSeuil,
        heures_restantes: heuresRestantes,
      },

      // Données freelance
      freelance: {
        ca_par_mois: caParMois,
        nombre_jours: totalJoursFreelance,
        heures: heuresFreelance,
      },

      // Répartition du temps
      repartition_temps: {
        intermittence: pourcentageIntermittence,
        freelance: pourcentageFreelance,
      },

      // Configuration utilisée
      configuration: {
        seuil_heures: seuilHeures,
        heures_par_jour: heuresParJour,
      },
    });
  } catch (error) {
    // Retourner une erreur
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
    // Récupérer la configuration
    let configuration = await Configuration.findOne();

    // Créer la configuration
    if (!configuration) {
      configuration = await Configuration.create({
        seuil_heures: 507,
        heures_par_jour: 8,
      });
    }

    // Modifier le seuil d'heures
    if (req.body.seuil_heures !== undefined) {
      const seuilHeures = Number(req.body.seuil_heures);

      // Vérifier la valeur
      if (!Number.isFinite(seuilHeures) || seuilHeures < 0) {
        return res.status(400).json({
          message: "Le seuil d'heures est invalide",
        });
      }

      configuration.seuil_heures = seuilHeures;
    }

    // Modifier les heures par jour
    if (req.body.heures_par_jour !== undefined) {
      const heuresParJour = Number(req.body.heures_par_jour);

      // Vérifier la valeur
      if (!Number.isFinite(heuresParJour) || heuresParJour <= 0) {
        return res.status(400).json({
          message: "Le nombre d'heures par jour est invalide",
        });
      }

      configuration.heures_par_jour = heuresParJour;
    }

    // Enregistrer les modifications
    await configuration.save();

    // Retourner la configuration
    res.status(200).json({
      message: "Configuration mise à jour",
      configuration,
    });
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la configuration",
      error: error.message,
    });
  }
};