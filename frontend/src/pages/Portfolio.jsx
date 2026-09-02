import {
  useEffect,
  useState,
} from "react";

import {
  getPortfolioProjects,
  deletePortfolioProject,
} from "../services/portfolioService";

import PortfolioForm from "../components/PortfolioForm";

function Portfolio() {
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

  // =========================
  // GET PROJECTS
  // =========================

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

  // =========================
  // CREATE
  // =========================

  const handleCreate = () => {
    setSelectedProject(null);

    setFormMode("create");

    setShowForm(true);
  };

  // =========================
  // VIEW
  // =========================

  const handleView = (project) => {
    setSelectedProject(project);

    setFormMode("view");

    setShowForm(true);
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (project) => {
    setSelectedProject(project);

    setFormMode("edit");

    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {
    setShowForm(false);

    setSelectedProject(null);

    setFormMode("create");
  };

  // =========================
  // DELETE
  // =========================

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

  // =========================
  // DATE
  // =========================

  const formatDate = (date) => {
    return new Date(
      date
    ).toLocaleDateString("fr-FR");
  };

  // =========================
  // VIDEO
  // =========================

  const getEmbedUrl = (url) => {
    if (!url) {
      return null;
    }

    try {
      // YouTube classique
      // https://youtube.com/watch?v=xxx

      if (
        url.includes(
          "youtube.com/watch"
        )
      ) {
        const videoUrl =
          new URL(url);

        const videoId =
          videoUrl.searchParams.get(
            "v"
          );

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // YouTube court
      // https://youtu.be/xxx

      if (
        url.includes("youtu.be/")
      ) {
        const videoId = url
          .split("youtu.be/")[1]
          ?.split("?")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // YouTube Shorts

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

      // Vimeo
      // https://vimeo.com/123456

      if (
        url.includes("vimeo.com/")
      ) {
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
    <div className="page-container">
      {/* HEADER */}

      <div className="page-header">
        <h1 className="page-title">
          Portfolio
        </h1>

        <button
          className="btn btn-primary"
          onClick={handleCreate}
        >
          + Nouveau projet
        </button>
      </div>

      {/* FILTRES */}

      <div className="missions-filters">
        <div className="filter-group">
          <label>
            Type :
          </label>

          <select
            value={tag}
            onChange={(e) =>
              setTag(
                e.target.value
              )
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
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <p className="loading-message">
          Chargement...
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* EMPTY */}

      {!loading &&
        projects.length === 0 && (
          <div className="empty-state">
            Aucun projet trouvé.
          </div>
        )}

      {/* PROJECTS */}

      {!loading &&
        projects.length > 0 && (
          <div className="portfolio-grid">
            {projects.map(
              (project) => {
                const embedUrl =
                  getEmbedUrl(
                    project.lien_video
                  );

                return (
                  <article
                    className="portfolio-card"
                    key={
                      project._id
                    }
                  >
                    {/* VIDEO */}

                    <div className="portfolio-video">
                      {embedUrl ? (
                        <iframe
                          src={
                            embedUrl
                          }
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

                    {/* CONTENT */}

                    <div className="portfolio-content">
                      <div className="portfolio-card-header">
                        <h2>
                          {
                            project.titre
                          }
                        </h2>

                        <span
                          className={`badge ${
                            project.tag ===
                            "pro"
                              ? "badge-intermittence"
                              : "badge-freelance"
                          }`}
                        >
                          {project.tag ===
                          "pro"
                            ? "Pro"
                            : "Perso"}
                        </span>
                      </div>

                      <p className="portfolio-date">
                        {formatDate(
                          project.date
                        )}
                      </p>

                      <p className="portfolio-description">
                        {
                          project.description
                        }
                      </p>

                      {/* ACTIONS */}

                      <div className="portfolio-actions">
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() =>
                            handleView(
                              project
                            )
                          }
                        >
                          Voir
                        </button>

                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() =>
                            handleEdit(
                              project
                            )
                          }
                        >
                          Modifier
                        </button>

                        <button
                          className="btn btn-danger btn-small"
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
              }
            )}
          </div>
        )}

      {/* MODAL */}

      {showForm && (
        <PortfolioForm
          project={selectedProject}
          mode={formMode}
          onClose={
            handleCloseForm
          }
          onSuccess={
            fetchProjects
          }
        />
      )}
    </div>
  );
}

export default Portfolio;