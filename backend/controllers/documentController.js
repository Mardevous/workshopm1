const fs = require("fs");
const path = require("path");

const Document = require("../models/Document");

// Obtenir le chemin du fichier
const getFilePath = (document) => {
  const fileName = path.basename(
    document.file_url
  );

  return path.join(
    __dirname,
    "..",
    "uploads",
    fileName
  );
};

// GET /api/documents
exports.getDocuments = async (req, res) => {
  try {
    // Récupérer les filtres
    const {
      categorie,
      mission_id,
    } = req.query;

    const filter = {};

    // Filtrer par catégorie
    if (categorie) {
      filter.categorie = categorie;
    }

    // Afficher les documents globaux
    if (mission_id === "global") {
      filter.mission_id = null;
    } else if (mission_id) {
      // Filtrer par mission
      filter.mission_id = mission_id;
    }

    // Rechercher les documents
    const documents = await Document.find(
      filter
    )
      // Ajouter les informations de la mission
      .populate(
        "mission_id",
        "client_production type date_debut date_fin"
      )
      // Trier du plus récent au plus ancien
      .sort({
        createdAt: -1,
      });

    // Retourner les documents
    res.status(200).json(documents);
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message:
        "Erreur lors de la récupération des documents",

      error: error.message,
    });
  }
};

// POST /api/documents
exports.createDocument = async (
  req,
  res
) => {
  try {
    // Vérifier le fichier
    if (!req.file) {
      return res.status(400).json({
        message: "Aucun fichier envoyé",
      });
    }

    // Vérifier la catégorie
    if (!req.body.categorie) {
      // Supprimer le fichier envoyé
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message:
          "Veuillez choisir une catégorie",
      });
    }

    // Créer le document
    const document = await Document.create({
      nom: req.file.originalname,

      categorie:
        req.body.categorie,

      // Enregistrer null sans mission
      mission_id:
        req.body.mission_id || null,

      file_url:
        `/uploads/${req.file.filename}`,

      taille: req.file.size,

      mime_type:
        req.file.mimetype,
    });

    // Retourner le document
    res.status(201).json(document);
  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({
      message:
        "Erreur lors de l'ajout du document",

      error: error.message,
    });
  }
};

// GET /api/documents/:id/view
exports.viewDocument = async (
  req,
  res
) => {
  try {
    // Rechercher le document
    const document =
      await Document.findById(
        req.params.id
      );

    // Vérifier le document
    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    // Obtenir le chemin du fichier
    const filePath =
      getFilePath(document);

    // Vérifier le fichier
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message:
          "Fichier introuvable sur le serveur",
      });
    }

    // Afficher dans le navigateur
    res.setHeader(
      "Content-Type",
      document.mime_type
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(
        document.nom
      )}"`
    );

    res.sendFile(filePath);
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message:
        "Erreur lors de l'ouverture du document",

      error: error.message,
    });
  }
};

// GET /api/documents/:id/download
exports.downloadDocument = async (
  req,
  res
) => {
  try {
    // Rechercher le document
    const document =
      await Document.findById(
        req.params.id
      );

    // Vérifier le document
    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    // Obtenir le chemin du fichier
    const filePath =
      getFilePath(document);

    // Vérifier le fichier
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message:
          "Fichier introuvable sur le serveur",
      });
    }

    // Télécharger le fichier
    res.download(
      filePath,
      document.nom
    );
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message:
        "Erreur lors du téléchargement du document",

      error: error.message,
    });
  }
};

// DELETE /api/documents/:id
exports.deleteDocument = async (
  req,
  res
) => {
  try {
    // Rechercher le document
    const document =
      await Document.findById(
        req.params.id
      );

    // Vérifier le document
    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    // Obtenir le chemin du fichier
    const filePath =
      getFilePath(document);

    // Supprimer le fichier du serveur
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer le document de MongoDB
    await document.deleteOne();

    // Retourner un message
    res.status(200).json({
      message:
        "Document supprimé avec succès",
    });
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message:
        "Erreur lors de la suppression du document",

      error: error.message,
    });
  }
};