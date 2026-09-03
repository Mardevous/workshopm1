const mongoose = require("mongoose");

// Schéma d'une mission
const missionSchema = new mongoose.Schema({
    // Client ou production
    client_production: {
      type: String,
      required: true,
      trim: true,
    },

    // Date de début
    date_debut: {
      type: Date,
      required: true,
    },

    // Date de fin
    date_fin: {
      type: Date,
      required: true,
    },

    // Type de mission
    type: {
      type: String,
      enum: ["intermittence", "freelance"],
      required: true,
    },

    // Statut de la mission
    statut: {
      type: String,
      enum: ["proposee", "confirmee", "terminee"],
      default: "proposee",
      required: true,
    },

    // Note facultative
    note: {
      type: String,
      trim: true,
      default: "",
    },

    // Nombre d'heures
    heures: {
      type: Number,
      min: 0,
      default: null,
    },

    // Nombre de cachets
    cachets: {
      type: Number,
      min: 0,
      default: null,
    },

    // Montant pour le freelance
    montant_ht: {
      type: Number,
      min: 0,
      required: function () {
        return this.type === "freelance";
      },
    },

    // Nombre de jours freelance
    nombre_jours: {
      type: Number,
      min: 0,
      required: function () {
        return this.type === "freelance";
      },
    },
},{timestamps: true,});

// Vérifier les dates
missionSchema.pre("validate", function () {
  if (this.date_debut && this.date_fin && this.date_fin < this.date_debut) {
    throw new Error(
      "La date de fin ne peut pas être avant la date de début."
    );
  }
});

// Export du modèle
module.exports = mongoose.model("Mission", missionSchema);