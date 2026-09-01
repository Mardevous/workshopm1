const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
    client_production: {
      type: String,
      required: true,
      trim: true,
    },

    date_debut: {
      type: Date,
      required: true,
    },

    date_fin: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["intermittence", "freelance"],
      required: true,
    },

    statut: {
      type: String,
      enum: ["proposee", "confirmee", "terminee"],
      default: "proposee",
      required: true,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    // Intermittence
    heures: {
      type: Number,
      min: 0,
      required: function () {
        return this.type === "intermittence";
      },
    },

    cachets: {
      type: Number,
      min: 0,
      default: null,
    },

    // Freelance
    montant_ht: {
      type: Number,
      min: 0,
      required: function () {
        return this.type === "freelance";
      },
    },

    nombre_jours: {
      type: Number,
      min: 0,
      required: function () {
        return this.type === "freelance";
      },
    },
},{timestamps: true,});

// La date de fin ne peut pas être avant la date de début
missionSchema.pre("validate", function () {
  if (this.date_debut && this.date_fin && this.date_fin < this.date_debut) {
    throw new Error(
      "La date de fin ne peut pas être avant la date de début."
    );
  }
});

module.exports = mongoose.model("Mission", missionSchema);