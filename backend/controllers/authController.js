const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const passwordValide = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValide) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

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

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};