import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import MissionForm from "../components/MissionForm";

import { getMissions } from "../services/missionService";

function Calendar() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [type, setType] = useState("");
    const [statut, setStatut] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState(null);
    const [selectedMission, setSelectedMission] = useState(null);

    const fetchMissions = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMissions(type,statut);

            setMissions(data);
        } catch (error) {
            setError(
                error.response?.data?.message || "Erreur lors du changement de missions"
                );
            } finally {
                setLoading(false);
            }
        };
        useEffect(() => {
            fetchMissions();
        },
         [type, statut]);

    const handleEventClick = (info) => {
        const mission = missions.find(
            (mission) => 
                String(mission._id) === String(info.event.id)
        );

        if (mission){
            setSelectedMission(mission);
            setFormMode("view");
            setShowForm(true);
        }
    };


    const getEventClassName = (mission) => {
    if (mission.type === "intermittence") {
        return "event-intermittence";
        }
        return "event-freelance";
};
    const addOneday = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() +1);

        return newDate.toISOString().split("T")[0];
    };

    const events = missions.map((mission) => ({
    id: mission._id,
    title : mission.client_production,
    start: mission.date_debut,
    end: addOneday(mission.date_fin),
    allDay: true,
    className: getEventClassName(mission),

    extendedProps: {
        type: mission.type,
        statut: mission.statut,
        heures: mission.heures,
        cachets: mission.cachets,
        montant_ht: mission.montant_ht,
        nombre_jours: mission.nombre_jours,
        note: mission.note,
    }

}));

    if (loading) {
        return <p>Chargement du calendrier...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMission(null);
    setFormMode(null);
  };

    return (
        <div>
            <label>Type: </label>
            <select
            value={type}
            onChange={(e) => setType(e.target.value)}>
            <option value="">Tous</option>
            <option value="intermittence">Intermittence</option>
            <option value="freelance">Freelance</option>
            </select>
        

        <label>Statut : </label>

        <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}>
            <option value="">Tous</option>
            <option value="proposee">Proposée</option>
            <option value="confirmee">Confirmée</option>
            <option value="terminee">Terminée</option>
            </select>

        
        <div>
            <span> 🔵Intermittence</span>
            <span> 🟠Freelance</span>
        </div>

        <div>
            <h1>Calendrier</h1>

            <FullCalendar
            plugins={[dayGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale="fr"
            events={events}
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,listMonth",
            }}

            

            eventClick={handleEventClick}
            />

            {showForm && (
            <MissionForm
                mission={selectedMission}
                mode={formMode}
                onClose={handleCloseForm}
                onSuccess={fetchMissions}
            />
            )}
        </div>
        </div>

        

        
    );
}

export default Calendar;