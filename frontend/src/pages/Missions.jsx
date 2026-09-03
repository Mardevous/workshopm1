import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import {
  getMissions,
  deleteMission,
  generateMissionPdf,
} from "../services/missionService";
import MissionForm from "../components/MissionForm";

function Missions() {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);

  const [type, setType] = useState("");
  const [statut, setStatut] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [
    selectedMission,
    setSelectedMission,
  ] = useState(null);

  const [formMode, setFormMode] =
    useState("create");

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMissions(
        type,
        statut
      );

      setMissions(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement des missions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async (
    mission
  ) => {
    try {
      setError("");

      const pdfBlob =
        await generateMissionPdf(
          mission._id
        );

      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      const link =
        document.createElement("a");

      link.href = pdfUrl;

      const safeClientName =
        mission.client_production
          ?.replace(
            /[^a-zA-Z0-9À-ÿ_-]/g,
            "_"
          ) || "mission";

      link.download =
        `recapitulatif-${safeClientName}.pdf`;

      document.body.appendChild(link);

      link.click();
      link.remove();

      window.URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la génération du PDF"
      );
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [type, statut]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreate = () => {
    setSelectedMission(null);
    setFormMode("create");
    setShowForm(true);
  };

  const handleView = (mission) => {
    setSelectedMission(mission);
    setFormMode("view");
    setShowForm(true);
  };

  const handleEdit = (mission) => {
    setSelectedMission(mission);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMission(null);
    setFormMode("create");
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette mission ?"
    );

    if (!confirmation) return;

    try {
      await deleteMission(id);
      await fetchMissions();
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

  const getInformations = (mission) => {
    if (
      mission.type === "intermittence"
    ) {
      return `${mission.heures || 0} h${
        mission.cachets
          ? ` / ${mission.cachets} cachet(s)`
          : ""
      }`;
    }

    return `${
      mission.montant_ht || 0
    } € HT / ${
      mission.nombre_jours || 0
    } jour(s)`;
  };

  const getStatusLabel = (statut) => {
    if (statut === "proposee") {
      return "Proposée";
    }

    if (statut === "confirmee") {
      return "Confirmée";
    }

    if (statut === "terminee") {
      return "Terminée";
    }

    return statut;
  };

  return (
    <div className="missions-page">
      <Link
        className="missions-back-link"
        to="/dashboard"
      >
        ← Retour au dashboard
      </Link>

      <div className="missions-header">
        <div>
          <h1>Missions</h1>

          <p>
            Gérez vos missions intermittentes
            et freelance.
          </p>
        </div>

        <button
          className="missions-logout-button"
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>

      <div className="missions-toolbar">
        <button
          className="missions-create-button"
          onClick={handleCreate}
        >
          + Nouvelle mission
        </button>

        <div className="missions-filters">
          <label>
            <span>Type</span>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="">
                Tous
              </option>

              <option value="intermittence">
                Intermittence
              </option>

              <option value="freelance">
                Freelance
              </option>
            </select>
          </label>

          <label>
            <span>Statut</span>

            <select
              value={statut}
              onChange={(e) =>
                setStatut(e.target.value)
              }
            >
              <option value="">
                Tous
              </option>

              <option value="proposee">
                Proposée
              </option>

              <option value="confirmee">
                Confirmée
              </option>

              <option value="terminee">
                Terminée
              </option>
            </select>
          </label>
        </div>
      </div>

      <div className="missions-legend">
        <span>
          <span
            className="
              legend-circle
              legend-blue
            "
          />

          Intermittence
        </span>

        <span>
          <span
            className="
              legend-circle
              legend-orange
            "
          />

          Freelance
        </span>
      </div>

      {showForm && (
        <MissionForm
          mission={selectedMission}
          mode={formMode}
          onClose={handleCloseForm}
          onSuccess={fetchMissions}
        />
      )}

      {loading && (
        <div className="missions-state">
          Chargement...
        </div>
      )}

      {error && (
        <p className="missions-error">
          {error}
        </p>
      )}

      {!loading &&
        missions.length === 0 && (
          <div className="missions-empty">
            <strong>
              Aucune mission trouvée
            </strong>

            <p>
              Modifiez les filtres ou
              ajoutez une nouvelle mission.
            </p>
          </div>
        )}

      {!loading &&
        missions.length > 0 && (
          <div className="missions-table-card">
            <div className="missions-table-header">
              <h2>Liste des missions</h2>

              <p>
                {missions.length} mission
                {missions.length > 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <div className="missions-table-wrapper">
              <table className="missions-table">
                <thead>
                  <tr>
                    <th>
                      Client / Production
                    </th>

                    <th>Dates</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Informations</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {missions.map(
                    (mission) => (
                      <tr key={mission._id}>
                        <td>
                          <strong className="mission-client">
                            {
                              mission.client_production
                            }
                          </strong>
                        </td>

                        <td>
                          <div className="mission-dates">
                            <span>
                              {formatDate(
                                mission.date_debut
                              )}
                            </span>

                            <span className="date-arrow">
                              →
                            </span>

                            <span>
                              {formatDate(
                                mission.date_fin
                              )}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`mission-type-badge ${
                              mission.type ===
                              "intermittence"
                                ? "mission-type-intermittence"
                                : "mission-type-freelance"
                            }`}
                          >
                            {mission.type ===
                            "intermittence"
                              ? "Intermittence"
                              : "Freelance"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`mission-status-badge status-${mission.statut}`}
                          >
                            {getStatusLabel(
                              mission.statut
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="mission-information">
                            {getInformations(
                              mission
                            )}
                          </span>
                        </td>

                        <td>
                          <div className="mission-actions">
                            <button
                              className="
                                action-button
                                action-view
                              "
                              onClick={() =>
                                handleView(
                                  mission
                                )
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
                                handleEdit(
                                  mission
                                )
                              }
                            >
                              Modifier
                            </button>

                            <button
                              className="
                                action-button
                                action-pdf
                              "
                              onClick={() =>
                                handleGeneratePdf(
                                  mission
                                )
                              }
                            >
                              Générer PDF
                            </button>

                            <button
                              className="
                                action-button
                                action-delete
                              "
                              onClick={() =>
                                handleDelete(
                                  mission._id
                                )
                              }
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}

export default Missions;