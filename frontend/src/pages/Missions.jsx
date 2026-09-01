import { useEffect, useState } from "react";
import {
  getMissions,
  deleteMission,
} from "../services/missionService";
import MissionForm from "../components/MissionForm";

function Missions() {
  const [missions, setMissions] = useState([]);

  const [type, setType] = useState("");
  const [statut, setStatut] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

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

  useEffect(() => {
    fetchMissions();
  }, [type, statut]);

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette mission ?"
    );

    if (!confirmation) return;

    try {
      await deleteMission(id);

      fetchMissions();
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
        <h1>Missions</h1>

        <button onClick={() => setShowForm(true)}>
            + Nouvelle mission
        </button>

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
                    {mission.type === "intermittence"
                        ? "Intermittence"
                        : "Freelance"}
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
                    <button>Voir</button>

                    <button>Modifier</button>

                    <button
                        onClick={() =>
                        handleDelete(mission._id)
                        }
                    >
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