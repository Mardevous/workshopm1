const Mission = require("../models/Mission");
const Document = require("../models/Document");
const PDFDocument = require("pdfkit");

// GET /api/missions
// Liste + filtres
exports.getMissions = async (req, res) => {
  try {
    // Récupérer les filtres
    const { type, statut } = req.query;

    const filter = {};

    // Filtrer par type
    if (type) {
      filter.type = type;
    }

    // Filtrer par statut
    if (statut) {
      filter.statut = statut;
    }

    // Rechercher et trier les missions
    const missions = await Mission.find(filter).sort({ date_debut: 1 });

    // Retourner les missions
    res.status(200).json(missions);
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la récupération des missions",
      error: error.message,
    });
  }
};

// GET /api/missions/:id
exports.getMissionById = async (req, res) => {
  try {
    // Rechercher la mission
    const mission = await Mission.findById(req.params.id);

    // Vérifier la mission
    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    // Retourner la mission
    res.status(200).json(mission);
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la récupération de la mission",
      error: error.message,
    });
  }
};

// POST /api/missions
exports.createMission = async (req, res) => {
  try {
    // Créer la mission
    const mission = new Mission(req.body);

    // Enregistrer la mission
    const savedMission = await mission.save();

    // Retourner la mission
    res.status(201).json(savedMission);
  } catch (error) {
    // Retourner une erreur
    res.status(400).json({
      message: "Erreur lors de la création de la mission",
      error: error.message,
    });
  }
};

// PATCH /api/missions/:id
exports.updateMission = async (req, res) => {
  try {
    // Modifier la mission
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Vérifier la mission
    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    // Retourner la mission
    res.status(200).json(mission);
  } catch (error) {
    // Retourner une erreur
    res.status(400).json({
      message: "Erreur lors de la modification de la mission",
      error: error.message,
    });
  }
};

// DELETE /api/missions/:id
exports.deleteMission = async (req, res) => {
  try {
    // Rechercher la mission
    const mission = await Mission.findById(req.params.id);

    // Vérifier la mission
    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    // Conserver les documents comme documents globaux
    await Document.updateMany(
      { mission_id: mission._id },
      { $set: { mission_id: null } }
    );

    // Supprimer la mission
    await Mission.findByIdAndDelete(mission._id);

    // Retourner un message
    res.status(200).json({
      message:
        "Mission supprimée. Les documents associés ont été conservés comme documents globaux.",
    });
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la suppression de la mission",
      error: error.message,
    });
  }
};



// GET /api/missions/:id/pdf
exports.generateMissionPdf = async (req, res) => {
  try {
    // Rechercher la mission
    const mission = await Mission.findById(req.params.id);

    // Vérifier la mission
    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    // Créer le document PDF
    const pdf = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    // Nettoyer le nom du client
    const safeClientName = (
      mission.client_production || "mission"
    )
      .replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_")
      .replace(/_+/g, "_");

    // Créer le nom du fichier
    const fileName =
      `recapitulatif-${safeClientName}.pdf`;

    // Définir le type du fichier
    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    // Définir le téléchargement
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    // Envoyer le PDF
    pdf.pipe(res);

    // Formater une date
    const formatDate = (date) => {
      if (!date) {
        return "Non renseignée";
      }

      return new Date(date).toLocaleDateString(
        "fr-FR"
      );
    };

    // Formater un statut
    const formatStatut = (statut) => {
      const statuts = {
        proposee: "Proposée",
        confirmee: "Confirmée",
        terminee: "Terminée",
      };

      return statuts[statut] || statut;
    };

    // Ajouter une information
    const addInformation = (label, value) => {
      pdf
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#222222")
        .text(`${label} : `, {
          continued: true,
        });

      pdf
        .font("Helvetica")
        .fillColor("#333333")
        .text(
          value === null ||
            value === undefined ||
            value === ""
            ? "Non renseigné"
            : String(value)
        );

      pdf.moveDown(0.6);
    };

    // En-tête
    pdf
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#222222")
      .text(
        "RÉCAPITULATIF DE MISSION",
        {
          align: "center",
        }
      );

    pdf.moveDown(0.5);

    // Ligne de séparation
    pdf
      .strokeColor("#72bdd1")
      .lineWidth(2)
      .moveTo(50, pdf.y)
      .lineTo(545, pdf.y)
      .stroke();

    pdf.moveDown(1.5);

    // Informations générales
    pdf
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#72bdd1")
      .text("Informations générales");

    pdf.moveDown();

    // Ajouter le client
    addInformation(
      "Client / Production",
      mission.client_production
    );

    // Ajouter la date de début
    addInformation(
      "Date de début",
      formatDate(mission.date_debut)
    );

    // Ajouter la date de fin
    addInformation(
      "Date de fin",
      formatDate(mission.date_fin)
    );

    // Ajouter le type
    addInformation(
      "Type",
      mission.type === "intermittence"
        ? "Intermittence"
        : "Freelance"
    );

    // Ajouter le statut
    addInformation(
      "Statut",
      formatStatut(mission.statut)
    );

    // Informations selon le type
    pdf.moveDown(0.8);

    pdf
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#72bdd1")
      .text(
        mission.type === "intermittence"
          ? "Informations intermittence"
          : "Informations freelance"
      );

    pdf.moveDown();

    // Informations d'intermittence
    if (mission.type === "intermittence") {
      addInformation(
        "Nombre d'heures",
        `${mission.heures || 0} h`
      );

      addInformation(
        "Nombre de cachets",
        mission.cachets || 0
      );
    }

    // Informations freelance
    if (mission.type === "freelance") {
      addInformation(
        "Montant HT",
        `${Number(
          mission.montant_ht || 0
        ).toFixed(2)} €`
      );

      addInformation(
        "Nombre de jours",
        mission.nombre_jours || 0
      );
    }

    // Note
    pdf.moveDown(0.8);

    pdf
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#72bdd1")
      .text("Note");

    pdf.moveDown();

    // Ajouter la note
    pdf
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#333333")
      .text(
        mission.note?.trim() ||
          "Aucune note renseignée.",
        {
          align: "justify",
        }
      );

    // Pied de page
    const generatedDate =
      new Date().toLocaleDateString("fr-FR");

    pdf
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#777777")
      .text(
        `Document généré le ${generatedDate}`,
        50,
        780,
        {
          align: "center",
          width: 495,
        }
      );

    // Terminer le PDF
    pdf.end();
  } catch (error) {
    /*
     * Une réponse PDF a peut-être déjà commencé.
     * On évite alors d'envoyer une seconde réponse JSON.
     */
    if (res.headersSent) {
      return res.end();
    }

    // Retourner une erreur
    res.status(500).json({
      message:
        "Erreur lors de la génération du PDF",
      error: error.message,
    });
  }
};