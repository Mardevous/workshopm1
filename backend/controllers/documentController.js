const fs = require("fs");
const path = require("path");

const Document = require("../models/Document");

// 获取服务器中的文件路径
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
    const {
      categorie,
      mission_id,
    } = req.query;

    const filter = {};

    if (categorie) {
      filter.categorie = categorie;
    }

    // 只查看全局 Documents
    if (mission_id === "global") {
      filter.mission_id = null;
    } else if (mission_id) {
      // 查看属于某条 Mission 的 Documents
      filter.mission_id = mission_id;
    }

    const documents = await Document.find(
      filter
    )
      .populate(
        "mission_id",
        "client_production type date_debut date_fin"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(documents);
  } catch (error) {
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
    if (!req.file) {
      return res.status(400).json({
        message: "Aucun fichier envoyé",
      });
    }

    if (!req.body.categorie) {
      // 数据创建失败时删除已经上传的文件
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message:
          "Veuillez choisir une catégorie",
      });
    }

    const document = await Document.create({
      nom: req.file.originalname,

      categorie:
        req.body.categorie,

      // 没有Mission时保存null
      mission_id:
        req.body.mission_id || null,

      file_url:
        `/uploads/${req.file.filename}`,

      taille: req.file.size,

      mime_type:
        req.file.mimetype,
    });

    res.status(201).json(document);
  } catch (error) {
    // MongoDB保存失败时，避免留下无用文件
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
    const document =
      await Document.findById(
        req.params.id
      );

    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    const filePath =
      getFilePath(document);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message:
          "Fichier introuvable sur le serveur",
      });
    }

    // 在浏览器中直接预览
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
    const document =
      await Document.findById(
        req.params.id
      );

    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    const filePath =
      getFilePath(document);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message:
          "Fichier introuvable sur le serveur",
      });
    }

    res.download(
      filePath,
      document.nom
    );
  } catch (error) {
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
    const document =
      await Document.findById(
        req.params.id
      );

    if (!document) {
      return res.status(404).json({
        message: "Document introuvable",
      });
    }

    const filePath =
      getFilePath(document);

    // 删除服务器中的真实文件
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除MongoDB记录
    await document.deleteOne();

    res.status(200).json({
      message:
        "Document supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la suppression du document",

      error: error.message,
    });
  }
};