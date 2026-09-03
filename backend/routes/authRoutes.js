const express = require("express");

// Créer le routeur
const router = express.Router();

// Importer la fonction de connexion
const {
  login,
} = require("../controllers/authController");

// Route de connexion
router.post("/login", login);

// Exporter le routeur
module.exports = router;