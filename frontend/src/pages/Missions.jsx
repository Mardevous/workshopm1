import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMissions, deleteMission, generateMissionPdf } from "../services/missionService";
import MissionForm from "../components/MissionForm";

function Missions() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);

  const [type, setType] = useState("");
  const [statut, setStatut] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [formMode, setFormMode] = useState("create");

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMissions(type, statut);

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

  const handleGeneratePdf = async (mission) => {
    try {
      setError("");

      const pdfBlob = await generateMissionPdf(
        mission._id
      );

      const pdfUrl = window.URL.createObjectURL(
        pdfBlob
      );

      const link = document.createElement("a");

      link.href = pdfUrl;

      const safeClientName =
        mission.client_production
          ?.replace(/[^a-zA-Z0-9À-ÿ_-]/g, "_") ||
        "mission";

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
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getInformations = (mission) => {
    if (mission.type === "intermittence") {
      return `${mission.heures || 0} h${
        mission.cachets
          ? ` / ${mission.cachets} cachet(s)`
          : ""
      }`;
    }

    return `${mission.montant_ht || 0} € HT / ${
      mission.nombre_jours || 0
    } jour(s)`;
  };

  return (
    <div>
      <button>
        <Link className="dashboard-link" to="/dashboard">
          Retour au dashboard
        </Link>
      </button>
      
      <div className="header">
        <h1>Missions</h1>

        <button onClick={logout}>
          Déconnexion
        </button>
      </div>

        <button onClick={handleCreate}>
            + Nouvelle mission
        </button>

        {showForm && (
          <MissionForm
            mission={selectedMission}
            mode={formMode}
            onClose={handleCloseForm}
            onSuccess={fetchMissions}
          />
        )}

        <div>
            <label>Type : </label>

            <select
                 value={type}
                onChange={(e) => setType(e.target.value)}
            >
            <option value="">Tous</option>
            <option value="intermittence">
                Intermittence
            </option>
            <option value="freelance">
                Freelance
            </option>
            </select>
        </div>

        <div>
            <label>Statut : </label>

            <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            >
            <option value="">Tous</option>
            <option value="proposee">Proposée</option>
            <option value="confirmee">Confirmée</option>
            <option value="terminee">Terminée</option>
            </select>
        </div>

        <div>
          <span> 🔵Intermittence</span>
          <span> 🟠Freelance</span>
        </div>

        {loading && <p>Chargement...</p>}

        {error && <p>{error}</p>}

        {!loading && missions.length === 0 && (
            <p>Aucune mission trouvée.</p>
        )}

        {!loading && missions.length > 0 && (
            <table border="1">
            <thead>
                <tr>
                <th>Client / Production</th>
                <th>Dates</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Informations</th>
                <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {missions.map((mission) => (
                <tr key={mission._id}>
                    <td>{mission.client_production}</td>

                    <td>
                    {formatDate(mission.date_debut)}
                    {" - "}
                    {formatDate(mission.date_fin)}
                    </td>

                    <td>
                    <span
                      className={`c-color ${
                        mission.type === "intermittence"
                          ? "event-intermittence"
                          : "event-freelance"
                      }`}
                    >
                      {mission.type === "intermittence"
                        ? "Intermittence"
                        : "Freelance"}
                    </span>
                  </td>

                    <td>
                    {mission.statut === "proposee" &&
                        "Proposée"}

                    {mission.statut === "confirmee" &&
                        "Confirmée"}

                    {mission.statut === "terminee" &&
                        "Terminée"}
                    </td>

                    <td>{getInformations(mission)}</td>

                    <td>
                      
                    <button onClick={() => handleView(mission)}>
                      Voir
                    </button>

                    <button onClick={() => handleEdit(mission)}>
                      Modifier
                    </button>

                    <button onClick={() => handleGeneratePdf(mission)}>
                      Générer PDF
                    </button>

                    <button onClick={() => handleDelete(mission._id)}>
                        Supprimer
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
    </div>
  );
}

export default Missions;