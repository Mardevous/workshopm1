const Mission = require("../models/Mission");
const Document = require("../models/Document");
const PDFDocument = require("pdfkit");

// GET /api/missions
// Liste + filtres
exports.getMissions = async (req, res) => {
  try {
    const { type, statut } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (statut) {
      filter.statut = statut;
    }

    const missions = await Mission.find(filter).sort({ date_debut: 1 });

    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des missions",
      error: error.message,
    });
  }
};

// GET /api/missions/:id
exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la mission",
      error: error.message,
    });
  }
};

// POST /api/missions
exports.createMission = async (req, res) => {
  try {
    const mission = new Mission(req.body);

    const savedMission = await mission.save();

    res.status(201).json(savedMission);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création de la mission",
      error: error.message,
    });
  }
};

// PATCH /api/missions/:id
exports.updateMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    res.status(200).json(mission);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la modification de la mission",
      error: error.message,
    });
  }
};

// DELETE /api/missions/:id
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    // 保留关联文件，但将它们变成全局文件
    await Document.updateMany(
      { mission_id: mission._id },
      { $set: { mission_id: null } }
    );

    await Mission.findByIdAndDelete(mission._id);

    res.status(200).json({
      message:
        "Mission supprimée. Les documents associés ont été conservés comme documents globaux.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la mission",
      error: error.message,
    });
  }
};



// GET /api/missions/:id/pdf
exports.generateMissionPdf = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        message: "Mission introuvable",
      });
    }

    const pdf = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const safeClientName = (
      mission.client_production || "mission"
    )
      .replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_")
      .replace(/_+/g, "_");

    const fileName =
      `recapitulatif-${safeClientName}.pdf`;

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    pdf.pipe(res);

    const formatDate = (date) => {
      if (!date) {
        return "Non renseignée";
      }

      return new Date(date).toLocaleDateString(
        "fr-FR"
      );
    };

    const formatStatut = (statut) => {
      const statuts = {
        proposee: "Proposée",
        confirmee: "Confirmée",
        terminee: "Terminée",
      };

      return statuts[statut] || statut;
    };

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

    addInformation(
      "Client / Production",
      mission.client_production
    );

    addInformation(
      "Date de début",
      formatDate(mission.date_debut)
    );

    addInformation(
      "Date de fin",
      formatDate(mission.date_fin)
    );

    addInformation(
      "Type",
      mission.type === "intermittence"
        ? "Intermittence"
        : "Freelance"
    );

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

    pdf.end();
  } catch (error) {
    /*
     * Une réponse PDF a peut-être déjà commencé.
     * On évite alors d'envoyer une seconde réponse JSON.
     */
    if (res.headersSent) {
      return res.end();
    }

    res.status(500).json({
      message:
        "Erreur lors de la génération du PDF",
      error: error.message,
    });
  }
};