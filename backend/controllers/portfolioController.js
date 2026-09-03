const PortfolioProject = require("../models/PortfolioProject");

// GET /api/portfolio
// Liste + filtre pro/perso
exports.getProjects = async (req, res) => {
  try {
    // Récupérer le filtre
    const { tag } = req.query;

    const filter = {};

    // Filtrer par type
    if (tag) {
      filter.tag = tag;
    }

    // Rechercher et trier les projets
    const projects = await PortfolioProject.find(filter).sort({
      date: -1,
    });

    // Retourner les projets
    res.status(200).json(projects);
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la récupération des projets",
      error: error.message,
    });
  }
};


// GET /api/portfolio/:id
exports.getProjectById = async (req, res) => {
  try {
    // Rechercher le projet
    const project = await PortfolioProject.findById(req.params.id);

    // Vérifier le projet
    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    // Retourner le projet
    res.status(200).json(project);
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la récupération du projet",
      error: error.message,
    });
  }
};


// POST /api/portfolio
exports.createProject = async (req, res) => {
  try {
    // Créer le projet
    const project = new PortfolioProject(req.body);

    // Enregistrer le projet
    const savedProject = await project.save();

    // Retourner le projet
    res.status(201).json(savedProject);
  } catch (error) {
    // Retourner une erreur
    res.status(400).json({
      message: "Erreur lors de la création du projet",
      error: error.message,
    });
  }
};


// PATCH /api/portfolio/:id
exports.updateProject = async (req, res) => {
  try {
    // Modifier le projet
    const project = await PortfolioProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Vérifier le projet
    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    // Retourner le projet
    res.status(200).json(project);
  } catch (error) {
    // Retourner une erreur
    res.status(400).json({
      message: "Erreur lors de la modification du projet",
      error: error.message,
    });
  }
};


// DELETE /api/portfolio/:id
exports.deleteProject = async (req, res) => {
  try {
    // Rechercher et supprimer le projet
    const project = await PortfolioProject.findByIdAndDelete(
      req.params.id
    );

    // Vérifier le projet
    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    // Retourner un message
    res.status(200).json({
      message: "Projet supprimé avec succès",
    });
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la suppression du projet",
      error: error.message,
    });
  }
};