const mongoose = require('mongoose');

// Schéma d'un utilisateur
const userSchema = new mongoose.Schema({

    // Adresse email
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Supprimer les espaces
    },

    // Mot de passe
    password: {
        type: String,
        required: true
    },

},{timestamps: true});

// Export du modèle
module.exports = mongoose.model('User', userSchema);