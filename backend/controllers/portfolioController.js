const PortfolioProject = require("../models/PortfolioProject");

// GET /api/portfolio
// Liste + filtre pro/perso
exports.getProjects = async (req, res) => {
  try {
    const { tag } = req.query;

    const filter = {};

    if (tag) {
      filter.tag = tag;
    }

    const projects = await PortfolioProject.find(filter).sort({
      date: -1,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des projets",
      error: error.message,
    });
  }
};


// GET /api/portfolio/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await PortfolioProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du projet",
      error: error.message,
    });
  }
};


// POST /api/portfolio
exports.createProject = async (req, res) => {
  try {
    const project = new PortfolioProject(req.body);

    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création du projet",
      error: error.message,
    });
  }
};


// PATCH /api/portfolio/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await PortfolioProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la modification du projet",
      error: error.message,
    });
  }
};


// DELETE /api/portfolio/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await PortfolioProject.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    res.status(200).json({
      message: "Projet supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du projet",
      error: error.message,
    });
  }
};