const Mission = require("../models/Mission");
const Document = require("../models/Document");

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