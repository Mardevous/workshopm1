import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import { getMissions } from "../services/missionService";

function Calendar() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                setLoading(true);

                const data = await getMissions();

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

    }, []);

    const getEventClassName = (mission) => {
    if (mission.type === "intermittence") {
        return "event-intermittence";
        }
        return "event-freelance";
};

const events = missions.map((mission) => ({
    id: mission._id,
    title : mission.client_production,
    start: mission.date_debut,
    end: mission.date_fin,

    className: getEventClassName(mission),

}));

    if (loading) {
        return <p>Chargement du calendrier...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
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
            />
        </div>
    );
}

export default Calendar;