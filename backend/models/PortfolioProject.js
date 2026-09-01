const mongoose = require("mongoose");

const portfolioProjectSchema = new mongoose.Schema({
    titre: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    tag: {
      type: String,
      enum: ["pro", "perso"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    lien_video: {
      type: String,
      required: true,
      trim: true,
    },
},{timestamps: true});


module.exports = mongoose.model("PortfolioProject", portfolioProjectSchema);