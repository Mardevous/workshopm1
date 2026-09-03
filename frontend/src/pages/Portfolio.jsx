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

  const [projects, setProjects] =
    useState([]);

  const [tag, setTag] = useState("");
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [formMode, setFormMode] =
    useState("create");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getPortfolioProjects(tag);

      setProjects(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement du portfolio"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [tag]);

  const handleCreate = () => {
    setSelectedProject(null);
    setFormMode("create");
    setShowForm(true);
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setFormMode("view");
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProject(null);
    setFormMode("create");
  };

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
      setError(
        error.response?.data?.message ||
          "Erreur lors de la suppression"
      );
    }
  };

  const formatDate = (date) => {
    return new Date(
      date
    ).toLocaleDateString("fr-FR");
  };

  const getEmbedUrl = (url) => {
    if (!url) {
      return null;
    }

    try {
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

      if (url.includes("youtu.be/")) {
        const videoId = url
          .split("youtu.be/")[1]
          ?.split("?")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

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
      <Link
        className="portfolio-back-link"
        to="/dashboard"
      >
        ← Retour au dashboard
      </Link>

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

      <div className="portfolio-toolbar">
        <button
          className="portfolio-create-button"
          onClick={handleCreate}
        >
          + Nouveau projet
        </button>

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

      {loading && (
        <div className="portfolio-state">
          Chargement...
        </div>
      )}

      {error && (
        <p className="portfolio-error">
          {error}
        </p>
      )}

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

      {!loading &&
        projects.length > 0 && (
          <div className="portfolio-grid">
            {projects.map((project) => {
              const embedUrl =
                getEmbedUrl(
                  project.lien_video
                );

              return (
                <article
                  className="portfolio-card"
                  key={project._id}
                >
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

                  <div className="portfolio-content">
                    <div className="portfolio-card-header">
                      <h2>
                        {project.titre}
                      </h2>

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

                    <p className="portfolio-date">
                      {formatDate(
                        project.date
                      )}
                    </p>

                    <p className="portfolio-description">
                      {project.description ||
                        "Aucune description."}
                    </p>

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