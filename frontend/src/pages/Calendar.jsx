import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import { getMissions } from "../services/missionService";

function Calendar() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [type, setType] = useState("");
    const [statut, setStatut] = useState("");

    useEffect(() => {
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

        fetchMissions();

    }, [type, statut]);

    const getEventClassName = (mission) => {
    if (mission.type === "intermittence") {
        return "event-intermittence";
        }
        return "event-freelance";
};
    const addOneday = (date) => {
        const newDate = new Date(date);
        newDate.serDate(newDate.getDate() +1);

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

    return (
        <div>
            <label>Type: </label>
            <select
            value={type}
            onChange={(e) => setType((e.target.value)}>
            <option value="">Tous</option>
            <option value="Intermittence">Intermittence</option>
            <option value="freelance">Freelance</option>
            </select>
        </div>

        <label>Statut : </label>

        <select
            value=(statut)
            onchange={(e) => setStatut(e.target.value)}>
            <option value="">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="En cours">En cours</option>
            <option value="Terminée">Terminée</option>
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
            haederToolbar={{
                left: "prev, next today",
                center: "title",
                right: "dayGridMonth,listMonth"
            }}

            eventClick={(info) => {
                console.log(info.event);
            }}
            />
        </div>

        
    );

export default Calendar;