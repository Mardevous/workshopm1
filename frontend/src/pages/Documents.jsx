import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import { getMissions } from "../services/missionService";

import {
  getDocuments,
  viewDocument,
  downloadDocument,
  deleteDocument,
} from "../services/documentService";

import DocumentForm from "../components/DocumentForm";

function Documents() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [missions, setMissions] = useState([]);

  const [filterCategorie, setFilterCategorie] =
    useState("");

  const [filterMission, setFilterMission] =
    useState("");

  const [missionSearch, setMissionSearch] =
    useState("");

  const [
    showMissionDropdown,
    setShowMissionDropdown,
  ] = useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments(
        filterCategorie,
        filterMission
      );

      setDocuments(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement des documents"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async () => {
    try {
      const data = await getMissions();
      setMissions(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement des missions"
      );
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [filterCategorie, filterMission]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "fr-FR"
    );
  };

  const formatCategorie = (categorie) => {
    const categories = {
      contrat: "Contrat",
      attestation_employeur:
        "Attestation employeur",
      devis: "Devis",
      facture: "Facture",
      autre: "Autre",
    };

    return categories[categorie] || categorie;
  };

  const selectedMissionLabel = (() => {
    if (!filterMission) {
      return "Toutes les missions";
    }

    if (filterMission === "global") {
      return "Documents globaux";
    }

    const selectedMission = missions.find(
      (mission) =>
        mission._id === filterMission
    );

    return (
      selectedMission?.client_production ||
      "Toutes les missions"
    );
  })();

  const filteredMissions = missions.filter(
    (mission) =>
      mission.client_production
        .toLowerCase()
        .startsWith(
          missionSearch.trim().toLowerCase()
        )
  );

  const selectMission = (
    missionId,
    missionName
  ) => {
    setFilterMission(missionId);
    setMissionSearch(missionName);
    setShowMissionDropdown(false);
  };

  const handleUploadSuccess = async () => {
    setMessage(
      "Document ajouté avec succès."
    );

    await fetchDocuments();
  };

  const handleView = async (document) => {
    try {
      setError("");

      const blob = await viewDocument(
        document._id
      );

      const fileBlob = new Blob([blob], {
        type:
          document.mime_type ||
          "application/octet-stream",
      });

      const url =
        window.URL.createObjectURL(fileBlob);

      const previewWindow = window.open(
        url,
        "_blank"
      );

      if (!previewWindow) {
        setError(
          "Le navigateur a bloqué l'ouverture du document."
        );
      }

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'ouverture du document"
      );
    }
  };

  const handleDownload = async (document) => {
    try {
      setError("");

      const blob = await downloadDocument(
        document._id
      );

      const fileBlob = new Blob([blob], {
        type:
          document.mime_type ||
          "application/octet-stream",
      });

      const url =
        window.URL.createObjectURL(fileBlob);

      const link =
        window.document.createElement("a");

      link.href = url;
      link.download = document.nom;

      window.document.body.appendChild(link);

      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du téléchargement"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce document ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDocument(id);

      setMessage(
        "Document supprimé avec succès."
      );

      await fetchDocuments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la suppression du document"
      );
    }
  };

  return (
    <div>
      <Link
        className="dashboard-link"
        to="/dashboard"
      >
        Retour au dashboard
      </Link>

      <div className="header">
        <h1>Documents</h1>

        <button onClick={logout}>
          Déconnexion
        </button>
      </div>

      <button
        onClick={() => {
          setMessage("");
          setError("");
          setShowForm(true);
        }}
      >
        + Ajouter un document
      </button>

      {showForm && (
        <DocumentForm
          missions={missions}
          onClose={() => setShowForm(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="mission-form-error">
          {error}
        </p>
      )}

      <h2>Mes documents</h2>

      <div className="document-filters">
        <div>
          <label>Catégorie : </label>

          <select
            value={filterCategorie}
            onChange={(e) =>
              setFilterCategorie(
                e.target.value
              )
            }
          >
            <option value="">
              Toutes
            </option>

            <option value="contrat">
              Contrat
            </option>

            <option value="attestation_employeur">
              Attestation employeur
            </option>

            <option value="devis">
              Devis
            </option>

            <option value="facture">
              Facture
            </option>

            <option value="autre">
              Autre
            </option>
          </select>
        </div>

        <div className="mission-filter">
          <label>Mission : </label>

          <div className="mission-dropdown">
            <input
              type="text"
              className="mission-dropdown-input"
              value={missionSearch}
              placeholder="Rechercher une mission"
              autoComplete="off"
              onFocus={() => {
                // 点击时清空文字并显示全部Mission
                setMissionSearch("");
                setShowMissionDropdown(true);
              }}
              onClick={() => {
                setShowMissionDropdown(true);
              }}
              onChange={(e) => {
                setMissionSearch(e.target.value);
                setShowMissionDropdown(true);
              }}
              onBlur={() => {
                // 等待下拉选项的点击事件完成
                setTimeout(() => {
                  setShowMissionDropdown(false);

                  if (!missionSearch) {
                    setMissionSearch(
                      selectedMissionLabel
                    );
                  }
                }, 150);
              }}
            />

            {showMissionDropdown && (
              <div className="mission-dropdown-panel">
                <div className="mission-dropdown-options">
                  <button
                    type="button"
                    className="mission-dropdown-option mission-dropdown-special"
                    onMouseDown={() =>
                      selectMission(
                        "",
                        "Toutes les missions"
                      )
                    }
                  >
                    Toutes les missions
                  </button>

                  <button
                    type="button"
                    className="mission-dropdown-option mission-dropdown-special"
                    onMouseDown={() =>
                      selectMission(
                        "global",
                        "Documents globaux"
                      )
                    }
                  >
                    Documents globaux
                  </button>

                  {filteredMissions.map((mission) => (
                    <button
                      type="button"
                      className="mission-dropdown-option"
                      key={mission._id}
                      onMouseDown={() =>
                        selectMission(
                          mission._id,
                          mission.client_production
                        )
                      }
                    >
                      <span
                        className={`mission-type-badge ${
                          mission.type ===
                          "intermittence"
                            ? "event-intermittence"
                            : "event-freelance"
                        }`}
                      >
                        {mission.type ===
                        "intermittence"
                          ? "Intermittence"
                          : "Freelance"}
                      </span>

                      <span className="mission-option-name">
                        {mission.client_production}
                      </span>

                      <span className="mission-option-date">
                        {formatDate(
                          mission.date_debut
                        )}

                        {" → "}

                        {formatDate(
                          mission.date_fin
                        )}
                      </span>
                    </button>
                  ))}

                  {filteredMissions.length === 0 && (
                    <p className="mission-option-empty">
                      Aucune mission trouvée
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <p>Chargement...</p>
      )}

      {!loading &&
        documents.length === 0 && (
          <p>
            Aucun document trouvé.
          </p>
        )}

      {!loading &&
        documents.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Mission</th>
                <th>Taille</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((document) => {
                const mission =
                  document.mission_id;

                return (
                  <tr key={document._id}>
                    <td>{document.nom}</td>

                    <td>
                      {formatCategorie(
                        document.categorie
                      )}
                    </td>

                    <td>
                      {mission ? (
                        <div className="document-mission">
                          <div className="document-mission-header">
                            <span
                              className={`mission-type-badge ${
                                mission.type ===
                                "intermittence"
                                  ? "event-intermittence"
                                  : "event-freelance"
                              }`}
                            >
                              {mission.type ===
                              "intermittence"
                                ? "Intermittence"
                                : "Freelance"}
                            </span>

                            <span className="document-mission-date">
                              {formatDate(
                                mission.date_debut
                              )}

                              {" → "}

                              {formatDate(
                                mission.date_fin
                              )}
                            </span>
                          </div>

                          <strong>
                            {
                              mission.client_production
                            }
                          </strong>
                        </div>
                      ) : (
                        <span>
                          Global
                        </span>
                      )}
                    </td>

                    <td>
                      {Math.round(
                        document.taille /
                          1024
                      )}{" "}
                      Ko
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleView(
                            document
                          )
                        }
                      >
                        Voir
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(
                            document
                          )
                        }
                      >
                        Télécharger
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            document._id
                          )
                        }
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
    </div>
  );
}

export default Documents;