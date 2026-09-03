const jwt = require("jsonwebtoken");

// Vérifier l'authentification
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer l'autorisation
    const authorization = req.headers.authorization;

    // Vérifier sa présence
    if (!authorization) {
      return res.status(401).json({
        message: "Accès non autorisé",
      });
    }

    // Séparer le type et le token
    const [type, token] = authorization.split(" ");

    // Vérifier le format
    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Token invalide",
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Enregistrer l'utilisateur
    req.user = decoded;

    // Continuer vers la route
    next();
  } catch (error) {
    // Refuser le token invalide
    return res.status(401).json({
      message: "Token invalide ou expiré",
    });
  }
};

module.exports = authMiddleware;