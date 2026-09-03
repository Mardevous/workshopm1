import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import MissionForm from "../components/MissionForm";

import {
  getMissions,
} from "../services/missionService";

function Calendar() {
  const navigate = useNavigate();

  // Liste des missions
  const [missions, setMissions] =
    useState([]);

  // État du chargement
  const [loading, setLoading] =
    useState(true);

  // Message d'erreur
  const [error, setError] =
    useState("");

  // Filtre par type
  const [type, setType] =
    useState("");

  // Filtre par statut
  const [statut, setStatut] =
    useState("");

  // Affichage du formulaire
  const [showForm, setShowForm] =
    useState(false);

  // Mode du formulaire
  const [formMode, setFormMode] =
    useState(null);

  // Mission sélectionnée
  const [
    selectedMission,
    setSelectedMission,
  ] = useState(null);

  // Déconnecter l'utilisateur
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

  // Actualiser avec les filtres
  useEffect(() => {
    fetchMissions();
  }, [type, statut]);

  // Ouvrir une mission
  const handleEventClick = (info) => {
    const mission = missions.find(
      (mission) =>
        String(mission._id) ===
        String(info.event.id)
    );

    if (mission) {
      setSelectedMission(mission);
      setFormMode("view");
      setShowForm(true);
    }
  };

  // Choisir la couleur
  const getEventClassName = (
    mission
  ) => {
    if (
      mission.type ===
      "intermittence"
    ) {
      return "event-intermittence";
    }

    return "event-freelance";
  };

  // Ajouter un jour
  const addOneday = (date) => {
    const newDate = new Date(date);

    newDate.setDate(
      newDate.getDate() + 1
    );

    return newDate
      .toISOString()
      .split("T")[0];
  };

  // Transformer les missions en événements
  const events = missions.map(
    (mission) => ({
      id: mission._id,
      title:
        mission.client_production,
      start: mission.date_debut,
      end: addOneday(
        mission.date_fin
      ),
      allDay: true,

      className:
        getEventClassName(mission),

      // Informations de la mission
      extendedProps: {
        type: mission.type,
        statut: mission.statut,
        heures: mission.heures,
        cachets: mission.cachets,
        montant_ht:
          mission.montant_ht,
        nombre_jours:
          mission.nombre_jours,
        note: mission.note,
      },
    })
  );

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMission(null);
    setFormMode(null);
  };

  return (
    <div className="calendar-page">
      {/* Retour au tableau de bord */}
      <Link
        className="calendar-back-link"
        to="/dashboard"
      >
        ← Retour au dashboard
      </Link>

      {/* En-tête */}
      <div className="calendar-header">
        <div>
          <h1>Calendrier</h1>

          <p>
            Consultez vos missions dans
            le calendrier.
          </p>
        </div>

        <button
          className="calendar-logout-button"
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>

      {/* Filtres et légende */}
      <div className="calendar-toolbar">
        {/* Filtres */}
        <div className="calendar-filters">
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
                setStatut(
                  e.target.value
                )
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

        {/* Légende des couleurs */}
        <div className="calendar-legend">
          <span>
            <span className="calendar-legend-circle calendar-legend-blue" />

            Intermittence
          </span>

          <span>
            <span className="calendar-legend-circle calendar-legend-orange" />

            Freelance
          </span>
        </div>
      </div>

      {/* Chargement */}
      {loading && (
        <div className="calendar-state">
          Chargement du calendrier...
        </div>
      )}

      {/* Erreur */}
      {error && (
        <p className="calendar-error">
          {error}
        </p>
      )}

      {/* Calendrier */}
      {!loading && !error && (
        <div className="calendar-card">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              listPlugin,
            ]}
            initialView="dayGridMonth"
            locale="fr"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right:
                "dayGridMonth,listMonth",
            }}
            buttonText={{
              today: "Aujourd'hui",
              month: "Mois",
              list: "Liste",
            }}
            eventClick={
              handleEventClick
            }
            height="auto"
          />
        </div>
      )}

      {/* Détails de la mission */}
      {showForm && (
        <MissionForm
          mission={selectedMission}
          mode={formMode}
          onClose={handleCloseForm}
          onSuccess={fetchMissions}
        />
      )}
    </div>
  );
}

export default Calendar;