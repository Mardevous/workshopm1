const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema({
    seuil_heures: {
      type: Number,
      required: true,
      default: 507,
      min: 0,
    },

    heures_par_jour: {
      type: Number,
      required: true,
      default: 8,
      min: 0,
    },
},{timestamps: true});

module.exports = mongoose.model("Configuration", configurationSchema);