const mongoose = require("mongoose");

// Schéma d'un document
const documentSchema = new mongoose.Schema({
    // Nom du fichier
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    // Catégorie du document
    categorie: {
      type: String,
      enum: [
        "contrat",
        "attestation_employeur",
        "devis",
        "facture",
        "autre",
      ],
      required: true,
    },

    // Mission liée, sinon null
    mission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },

    // Chemin du fichier
    file_url: {
      type: String,
      required: true,
    },

    // Taille du fichier
    taille: {
      type: Number,
      required: true,
      min: 0,
    },

    // Type du fichier
    mime_type: {
      type: String,
      required: true,
    },
},{timestamps: true});

// Export du modèle
module.exports = mongoose.model("Document", documentSchema);