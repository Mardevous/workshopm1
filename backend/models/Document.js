const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    nom: {
      type: String,
      required: true,
      trim: true,
    },

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

    // Peut être null si le document n'est lié à aucune mission
    mission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },

    file_url: {
      type: String,
      required: true,
    },

    taille: {
      type: Number,
      required: true,
      min: 0,
    },

    mime_type: {
      type: String,
      required: true,
    },
},{timestamps: true});

module.exports = mongoose.model("Document", documentSchema);