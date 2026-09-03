const mongoose = require("mongoose");

// Schéma d'un projet du portfolio
const portfolioProjectSchema = new mongoose.Schema({
    // Titre du projet
    titre: {
      type: String,
      required: true,
      trim: true,
    },

    // Description du projet
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Type du projet
    tag: {
      type: String,
      enum: ["pro", "perso"],
      required: true,
    },

    // Date du projet
    date: {
      type: Date,
      required: true,
    },

    // Lien de la vidéo
    lien_video: {
      type: String,
      required: true,
      trim: true,
    },
},{timestamps: true});

// Export du modèle
module.exports = mongoose.model("PortfolioProject", portfolioProjectSchema);