const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Route de connexion
// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    // Récupérer les informations
    const { email, password } = req.body;

    // Vérifier les champs
    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires",
      });
    }

    // Chercher l'utilisateur
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Vérifier l'utilisateur
    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const passwordValide = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValide) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // Créer le token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Retourner le token
    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    // Retourner une erreur
    res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};