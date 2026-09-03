import { useEffect, useState } from "react";

import {
  createPortfolioProject,
  updatePortfolioProject,
} from "../services/portfolioService";

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
  const [form, setForm] =
    useState(emptyForm);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const formatDateForInput = (date) => {
    if (!date) return "";

    return new Date(date)
      .toISOString()
      .split("T")[0];
  };

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
      setForm({
        ...emptyForm,
      });
    }

    setError("");
  }, [project, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "view") {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = {
        titre: form.titre,
        description: form.description,
        tag: form.tag,
        date: form.date,
        lien_video: form.lien_video,
      };

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

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
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
        <div className="mission-form-header">
          <div>
            <h2>
              {mode === "create" &&
                "Nouveau projet"}

              {mode === "view" &&
                "Détails du projet"}

              {mode === "edit" &&
                "Modifier le projet"}
            </h2>

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

        <form
          className="mission-form"
          onSubmit={handleSubmit}
        >
          <fieldset
            disabled={mode === "view"}
          >
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

          {error && (
            <p className="mission-form-error">
              {error}
            </p>
          )}

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