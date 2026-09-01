const fs = require("fs");
const path = require("path");
const Document = require("../models/Document");

// GET /api/documents
exports.getDocuments = async (req, res) => {
  try {
    const { categorie, mission_id } = req.query;

    const filter = {};

    if (categorie) {
      filter.categorie = categorie;
    }

    if (mission_id) {
      filter.mission_id = mission_id;
    }

    const documents = await Document.find(filter)
      .populate("mission_id", "client_production")
      .sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des documents",
      error: error.message,
    });
  }
};

// POST /api/documents
exports.createDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Aucun fichier envoyé",
      });
    }

    const document = await Document.create({
      nom: req.file.originalname,
      categorie: req.body.categorie,
      mission_id: req.body.mission_id || null,
      file_url: `/uploads/${req.file.filename}`,
      taille: req.file.size,
      mime_type: req.file.mimetype,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de l'ajout du document",
      error: error.message,
    });
  }
};

// DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      document.file_url
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();

    res.status(200).json({
      message: "Document supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du document",
      error: error.message,
    });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    const fileName = path.basename(document.file_url);

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      fileName
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Fichier introuvable sur le serveur",
      });
    }

    res.download(filePath, document.nom);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du téléchargement du document",
      error: error.message,
    });
  }
};