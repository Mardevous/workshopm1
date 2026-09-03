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

  // Liste des missions
  const [missions, setMissions] = useState([]);

  // Filtres
  const [type, setType] = useState("");
  const [statut, setStatut] = useState("");

  // Chargement et erreur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Affichage du formulaire
  const [showForm, setShowForm] = useState(false);

  // Mission sélectionnée
  const [
    selectedMission,
    setSelectedMission,
  ] = useState(null);

  // Mode du formulaire
  const [formMode, setFormMode] =
    useState("create");

  // Récupérer les missions
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
      // Afficher l'erreur
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement des missions"
      );
    } finally {
      setLoading(false);
    }
  };

  // Générer le PDF
  const handleGeneratePdf = async (
    mission
  ) => {
    try {
      setError("");

      const pdfBlob =
        await generateMissionPdf(
          mission._id
        );

      // Créer une URL temporaire
      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      // Créer un lien
      const link =
        document.createElement("a");

      link.href = pdfUrl;

      // Nettoyer le nom du client
      const safeClientName =
        mission.client_production
          ?.replace(
            /[^a-zA-Z0-9À-ÿ_-]/g,
            "_"
          ) || "mission";

      link.download =
        `recapitulatif-${safeClientName}.pdf`;

      document.body.appendChild(link);

      // Télécharger le PDF
      link.click();
      link.remove();

      window.URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      // Afficher l'erreur
      setError(
        error.response?.data?.message ||
          "Erreur lors de la génération du PDF"
      );
    }
  };

  // Actualiser avec les filtres
  useEffect(() => {
    fetchMissions();
  }, [type, statut]);

  // Déconnecter l'utilisateur
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Ouvrir le formulaire de création
  const handleCreate = () => {
    setSelectedMission(null);
    setFormMode("create");
    setShowForm(true);
  };

  // Afficher une mission
  const handleView = (mission) => {
    setSelectedMission(mission);
    setFormMode("view");
    setShowForm(true);
  };

  // Modifier une mission
  const handleEdit = (mission) => {
    setSelectedMission(mission);
    setFormMode("edit");
    setShowForm(true);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMission(null);
    setFormMode("create");
  };

  // Supprimer une mission
  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette mission ?"
    );

    if (!confirmation) return;

    try {
      await deleteMission(id);
      await fetchMissions();
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

  // Formater les informations
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

  // Formater le statut
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
      {/* Retour au tableau de bord */}
      <Link
        className="missions-back-link"
        to="/dashboard"
      >
        ← Retour au dashboard
      </Link>

      {/* En-tête */}
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

      {/* Outils et filtres */}
      <div className="missions-toolbar">
        {/* Bouton de création */}
        <button
          className="missions-create-button"
          onClick={handleCreate}
        >
          + Nouvelle mission
        </button>

        {/* Filtres */}
        <div className="missions-filters">
          {/* Filtre par type */}
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

          {/* Filtre par statut */}
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

      {/* Légende des couleurs */}
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

      {/* Formulaire de mission */}
      {showForm && (
        <MissionForm
          mission={selectedMission}
          mode={formMode}
          onClose={handleCloseForm}
          onSuccess={fetchMissions}
        />
      )}

      {/* Chargement */}
      {loading && (
        <div className="missions-state">
          Chargement...
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="missions-error">
          {error}
        </p>
      )}

      {/* Aucune mission */}
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

      {/* Liste des missions */}
      {!loading &&
        missions.length > 0 && (
          <div className="missions-table-card">
            {/* Informations de la liste */}
            <div className="missions-table-header">
              <h2>Liste des missions</h2>

              <p>
                {missions.length} mission
                {missions.length > 1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* Tableau */}
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
                  {/* Afficher les missions */}
                  {missions.map(
                    (mission) => (
                      <tr key={mission._id}>
                        {/* Client */}
                        <td>
                          <strong className="mission-client">
                            {
                              mission.client_production
                            }
                          </strong>
                        </td>

                        {/* Dates */}
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

                        {/* Type */}
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

                        {/* Statut */}
                        <td>
                          <span
                            className={`mission-status-badge status-${mission.statut}`}
                          >
                            {getStatusLabel(
                              mission.statut
                            )}
                          </span>
                        </td>

                        {/* Informations */}
                        <td>
                          <span className="mission-information">
                            {getInformations(
                              mission
                            )}
                          </span>
                        </td>

                        {/* Boutons d'action */}
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