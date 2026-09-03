const mongoose = require("mongoose");

// Schéma de la configuration
const configurationSchema = new mongoose.Schema({
    // Seuil d'heures à atteindre
    seuil_heures: {
      type: Number,
      required: true,
      default: 507,
      min: 0,
    },

    // Nombre d'heures par jour
    heures_par_jour: {
      type: Number,
      required: true,
      default: 8,
      min: 0,
    },
},{timestamps: true});

// Export du modèle
module.exports = mongoose.model("Configuration", configurationSchema);