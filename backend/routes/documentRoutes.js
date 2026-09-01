const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDocuments,
  createDocument,
  downloadDocument,
  deleteDocument,
} = require("../controllers/documentController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo
  },

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


router.use(authMiddleware);
router.get("/", getDocuments);
router.get("/:id/download", downloadDocument);
router.post("/", upload.single("fichier"), createDocument);
router.delete("/:id", deleteDocument);


module.exports = router;