import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  getPortfolioProjects,
  deletePortfolioProject,
} from "../services/portfolioService";

import PortfolioForm from "../components/PortfolioForm";

function Portfolio() {
  const navigate = useNavigate();

  // Liste des projets
  const [projects, setProjects] =
    useState([]);

  // Filtre par type
  const [tag, setTag] = useState("");

  // État du chargement
  const [loading, setLoading] =
    useState(true);

  // Message d'erreur
  const [error, setError] =
    useState("");

  // Affichage du formulaire
  const [showForm, setShowForm] =
    useState(false);

  // Projet sélectionné
  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  // Mode du formulaire
  const [formMode, setFormMode] =
    useState("create");

  // Déconnecter l'utilisateur
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Récupérer les projets
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getPortfolioProjects(tag);

      setProjects(data);
    } catch (error) {
      // Afficher l'erreur
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement du portfolio"
      );
    } finally {
      setLoading(false);
    }
  };

  // Actualiser avec le filtre
  useEffect(() => {
    fetchProjects();
  }, [tag]);

  // Ouvrir le formulaire de création
  const handleCreate = () => {
    setSelectedProject(null);
    setFormMode("create");
    setShowForm(true);
  };

  // Afficher un projet
  const handleView = (project) => {
    setSelectedProject(project);
    setFormMode("view");
    setShowForm(true);
  };

  // Modifier un projet
  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormMode("edit");
    setShowForm(true);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProject(null);
    setFormMode("create");
  };

  // Supprimer un projet
  const handleDelete = async (id) => {
    const confirmation =
      window.confirm(
        "Voulez-vous vraiment supprimer ce projet ?"
      );

    if (!confirmation) {
      return;
    }

    try {
      await deletePortfolioProject(id);
      await fetchProjects();
    } catch (error) {
      // Afficher l'erreur
      setError(
        error.response?.data?.message ||
          "Erreur lors de la suppression"
      );
    }
  };

  // Formater une date
  const formatDate = (date) => {
    return new Date(
      date
    ).toLocaleDateString("fr-FR");
  };

  // Créer le lien de la vidéo
  const getEmbedUrl = (url) => {
    if (!url) {
      return null;
    }

    try {
      // Lien YouTube classique
      if (
        url.includes(
          "youtube.com/watch"
        )
      ) {
        const videoUrl =
          new URL(url);

        const videoId =
          videoUrl.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Lien YouTube court
      if (url.includes("youtu.be/")) {
        const videoId = url
          .split("youtu.be/")[1]
          ?.split("?")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Lien YouTube Shorts
      if (
        url.includes(
          "youtube.com/shorts/"
        )
      ) {
        const videoId = url
          .split(
            "youtube.com/shorts/"
          )[1]
          ?.split("?")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Lien Vimeo
      if (url.includes("vimeo.com/")) {
        const videoId = url
          .split("vimeo.com/")[1]
          ?.split("?")[0];

        if (videoId) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="portfolio-page">
      {/* Retour au tableau de bord */}
      <Link
        className="portfolio-back-link"
        to="/dashboard"
      >
        ← Retour au dashboard
      </Link>

      {/* En-tête */}
      <div className="portfolio-page-header">
        <div>
          <h1>Portfolio</h1>

          <p>
            Présentez vos projets
            professionnels et personnels.
          </p>
        </div>

        <button
          className="portfolio-logout-button"
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>

      {/* Outils et filtres */}
      <div className="portfolio-toolbar">
        {/* Bouton de création */}
        <button
          className="portfolio-create-button"
          onClick={handleCreate}
        >
          + Nouveau projet
        </button>

        {/* Filtre par type */}
        <div className="portfolio-filters">
          <label>
            <span>Type</span>

            <select
              value={tag}
              onChange={(e) =>
                setTag(e.target.value)
              }
            >
              <option value="">
                Tous
              </option>

              <option value="pro">
                Professionnel
              </option>

              <option value="perso">
                Personnel
              </option>
            </select>
          </label>
        </div>
      </div>

      {/* Chargement */}
      {loading && (
        <div className="portfolio-state">
          Chargement...
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="portfolio-error">
          {error}
        </p>
      )}

      {/* Aucun projet */}
      {!loading &&
        projects.length === 0 && (
          <div className="portfolio-empty">
            <strong>
              Aucun projet trouvé
            </strong>

            <p>
              Modifiez le filtre ou
              ajoutez un nouveau projet.
            </p>
          </div>
        )}

      {/* Liste des projets */}
      {!loading &&
        projects.length > 0 && (
          <div className="portfolio-grid">
            {projects.map((project) => {
              // Transformer le lien vidéo
              const embedUrl =
                getEmbedUrl(
                  project.lien_video
                );

              return (
                <article
                  className="portfolio-card"
                  key={project._id}
                >
                  {/* Vidéo du projet */}
                  <div className="portfolio-video">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={
                          project.titre
                        }
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="portfolio-no-video">
                        Vidéo non
                        disponible
                      </div>
                    )}
                  </div>

                  {/* Informations du projet */}
                  <div className="portfolio-content">
                    <div className="portfolio-card-header">
                      <h2>
                        {project.titre}
                      </h2>

                      {/* Type du projet */}
                      <span
                        className={`portfolio-tag ${
                          project.tag ===
                          "pro"
                            ? "portfolio-tag-pro"
                            : "portfolio-tag-perso"
                        }`}
                      >
                        {project.tag ===
                        "pro"
                          ? "Professionnel"
                          : "Personnel"}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="portfolio-date">
                      {formatDate(
                        project.date
                      )}
                    </p>

                    {/* Description */}
                    <p className="portfolio-description">
                      {project.description ||
                        "Aucune description."}
                    </p>

                    {/* Boutons d'action */}
                    <div className="portfolio-actions">
                      <button
                        className="
                          action-button
                          action-view
                        "
                        onClick={() =>
                          handleView(project)
                        }
                      >
                        Voir
                      </button>

                      <button
                        className="
                          action-button
                          action-edit
                        "
                        onClick={() =>
                          handleEdit(project)
                        }
                      >
                        Modifier
                      </button>

                      <button
                        className="
                          action-button
                          action-delete
                        "
                        onClick={() =>
                          handleDelete(
                            project._id
                          )
                        }
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      {/* Formulaire du projet */}
      {showForm && (
        <PortfolioForm
          project={selectedProject}
          mode={formMode}
          onClose={handleCloseForm}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
}

export default Portfolio;