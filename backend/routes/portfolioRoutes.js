const express = require("express");

// Créer le routeur
const router = express.Router();

// Vérifier l'utilisateur
const authMiddleware = require("../middleware/authMiddleware");

// Importer les fonctions
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/portfolioController");

// Protéger les routes
router.use(authMiddleware);

// Afficher les projets
router.get("/", getProjects);

// Afficher un projet
router.get("/:id", getProjectById);

// Créer un projet
router.post("/", createProject);

// Modifier un projet
router.patch("/:id", updateProject);

// Supprimer un projet
router.delete("/:id", deleteProject);

module.exports = router;