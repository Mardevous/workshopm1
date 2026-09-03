import { useEffect, useState } from "react";

import {
  createPortfolioProject,
  updatePortfolioProject,
} from "../services/portfolioService";

// Formulaire vide
const emptyForm = {
  titre: "",
  description: "",
  tag: "pro",
  date: "",
  lien_video: "",
};

function PortfolioForm({
  project,
  mode = "create",
  onClose,
  onSuccess,
}) {
  // Données du formulaire
  const [form, setForm] = useState(emptyForm);

  // Message d'erreur
  const [error, setError] = useState("");

  // État du chargement
  const [loading, setLoading] = useState(false);

  // Formater la date
  const formatDateForInput = (date) => {
    if (!date) return "";

    return new Date(date)
      .toISOString()
      .split("T")[0];
  };

  // Remplir le formulaire
  useEffect(() => {
    if (project) {
      setForm({
        titre: project.titre || "",

        description:
          project.description || "",

        tag: project.tag || "pro",

        date:
          formatDateForInput(
            project.date
          ),

        lien_video:
          project.lien_video || "",
      });
    } else {
      // Réinitialiser le formulaire
      setForm({
        ...emptyForm,
      });
    }

    setError("");
  }, [project, mode]);

  // Modifier un champ
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Envoyer le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bloquer en mode lecture
    if (mode === "view") {
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Préparer les données
      const data = {
        titre: form.titre,
        description: form.description,
        tag: form.tag,
        date: form.date,
        lien_video: form.lien_video,
      };

      // Modifier ou créer
      if (mode === "edit") {
        await updatePortfolioProject(
          project._id,
          data
        );
      } else {
        await createPortfolioProject(
          data
        );
      }

      // Actualiser la liste
      if (onSuccess) {
        await onSuccess();
      }

      // Fermer le formulaire
      onClose();
    } catch (error) {
      // Afficher l'erreur
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          (mode === "edit"
            ? "Erreur lors de la modification du projet"
            : "Erreur lors de la création du projet")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fenêtre du formulaire
    <div
      className="mission-form-overlay"
      onMouseDown={onClose}
    >
      <div
        className="
          mission-form-container
          portfolio-form-container
        "
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        {/* En-tête */}
        <div className="mission-form-header">
          <div>
            {/* Titre selon le mode */}
            <h2>
              {mode === "create" &&
                "Nouveau projet"}

              {mode === "view" &&
                "Détails du projet"}

              {mode === "edit" &&
                "Modifier le projet"}
            </h2>

            {/* Description selon le mode */}
            <p>
              {mode === "create" &&
                "Ajoutez un projet à votre portfolio."}

              {mode === "view" &&
                "Consultez les informations du projet."}

              {mode === "edit" &&
                "Modifiez les informations du projet."}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <form
          className="mission-form"
          onSubmit={handleSubmit}
        >
          {/* Désactiver en mode lecture */}
          <fieldset
            disabled={mode === "view"}
          >
            {/* Titre du projet */}
            <div className="mission-form-field">
              <label htmlFor="titre">
                Titre
              </label>

              <input
                id="titre"
                type="text"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                placeholder="Titre du projet"
                required
              />
            </div>

            {/* Description du projet */}
            <div className="mission-form-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Décrivez votre projet..."
              />
            </div>

            {/* Date et type */}
            <div className="portfolio-form-grid">
              <div className="mission-form-field">
                <label htmlFor="date">
                  Date
                </label>

                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mission-form-field">
                <label htmlFor="tag">
                  Type
                </label>

                <select
                  id="tag"
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                >
                  <option value="pro">
                    Professionnel
                  </option>

                  <option value="perso">
                    Personnel
                  </option>
                </select>
              </div>
            </div>

            {/* Lien de la vidéo */}
            <div className="mission-form-field">
              <label htmlFor="lien_video">
                Lien vidéo
              </label>

              <input
                id="lien_video"
                type="url"
                name="lien_video"
                value={form.lien_video}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />

              <p className="portfolio-video-help">
                Liens YouTube, YouTube
                Shorts et Vimeo acceptés.
              </p>
            </div>
          </fieldset>

          {/* Message d'erreur */}
          {error && (
            <p className="mission-form-error">
              {error}
            </p>
          )}

          {/* Boutons */}
          <div className="mission-form-actions">
            <button
              type="button"
              className="mission-cancel-button"
              onClick={onClose}
            >
              {mode === "view"
                ? "Fermer"
                : "Annuler"}
            </button>

            {/* Bouton d'enregistrement */}
            {mode !== "view" && (
              <button
                type="submit"
                className="mission-save-button"
                disabled={loading}
              >
                {loading
                  ? "Enregistrement..."
                  : mode === "edit"
                  ? "Enregistrer les modifications"
                  : "Enregistrer"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PortfolioForm;