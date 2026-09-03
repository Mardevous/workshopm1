const express = require("express");

// Créer le routeur
const router = express.Router();

// Vérifier l'utilisateur
const authMiddleware = require("../middleware/authMiddleware");

// Importer les fonctions du dashboard
const { getDashboard, updateConfiguration } = require("../controllers/dashboardController");

// Afficher le dashboard
router.get("/", authMiddleware, getDashboard);

// Modifier la configuration
router.patch("/configuration", authMiddleware, updateConfiguration);

// Exporter le routeur
module.exports = router;