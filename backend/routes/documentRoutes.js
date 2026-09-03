const express = require("express");
const multer = require("multer");
const path = require("path");

// Créer le routeur
const router = express.Router();

// Vérifier l'utilisateur
const authMiddleware = require("../middleware/authMiddleware");

// Importer les fonctions
const {
  getDocuments,
  createDocument,
  downloadDocument,
  deleteDocument,
} = require("../controllers/documentController");

// Configurer le stockage
const storage = multer.diskStorage({
  // Dossier des fichiers
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  // Créer un nom unique
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// Configurer l'envoi
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo
  },

  // Vérifier le type
  fileFilter: (req, file, cb) => {
    const typesAutorises = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!typesAutorises.includes(file.mimetype)) {
      return cb(
        new Error("Seuls les fichiers PDF, JPG et PNG sont autorisés")
      );
    }

    cb(null, true);
  },
});

// Protéger les routes
router.use(authMiddleware);

// Routes des documents
router.get("/", getDocuments);
router.get("/:id/download", downloadDocument);
router.post("/", upload.single("fichier"), createDocument);
router.delete("/:id", deleteDocument);

module.exports = router;