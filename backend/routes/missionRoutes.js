const express = require("express");

// Créer le routeur
const router = express.Router();

// Vérifier l'utilisateur
const authMiddleware = require("../middleware/authMiddleware");

// Importer les fonctions
const {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
  generateMissionPdf,
} = require("../controllers/missionController");

// Protéger les routes
router.use(authMiddleware);

// Afficher les missions
router.get("/", getMissions);

// Placer avant router.get("/:id")
router.get("/:id/pdf", generateMissionPdf);

// Afficher une mission
router.get("/:id", getMissionById);

// Créer une mission
router.post("/", createMission);

// Modifier une mission
router.patch("/:id", updateMission);

// Supprimer une mission
router.delete("/:id", deleteMission);

module.exports = router;