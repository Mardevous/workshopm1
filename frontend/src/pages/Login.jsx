import { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  login,
} from "../services/authService";

function Login() {
  const navigate = useNavigate();

  // Adresse email
  const [email, setEmail] =
    useState("");

  // Mot de passe
  const [password, setPassword] =
    useState("");

  // Message d'erreur
  const [error, setError] =
    useState("");

  // État du chargement
  const [loading, setLoading] =
    useState(false);

  // Envoyer le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Connecter l'utilisateur
      const data = await login(
        email,
        password
      );

      // Enregistrer le token
      localStorage.setItem(
        "token",
        data.token
      );

      // Aller au tableau de bord
      navigate("/dashboard");
    } catch (error) {
      // Afficher l'erreur
      setError(
        error.response?.data?.message ||
          "Erreur lors de la connexion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Page de connexion
    <div className="login-page">
      <div className="login-card">
        {/* En-tête */}
        <div className="login-header">
          {/* Logo */}
          <div className="login-logo">
            F
          </div>

          <h1>Connexion</h1>

          <p>
            Connectez-vous pour gérer
            votre activité.
          </p>
        </div>

        {/* Formulaire */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          {/* Champ email */}
          <div className="login-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="exemple@email.fr"
              autoComplete="email"
              required
            />
          </div>

          {/* Champ mot de passe */}
          <div className="login-field">
            <label htmlFor="password">
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {/* Bouton de connexion */}
          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>
        </form>

        {/* Pied de page */}
        <p className="login-footer">
          Fassil — Gestion des missions
          intermittentes et freelance
        </p>
      </div>
    </div>
  );
}

export default Login;