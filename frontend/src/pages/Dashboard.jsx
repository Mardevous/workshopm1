import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboard(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Erreur lors du chargement du tableau de bord"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Tableau de bord</h1>

      <button>
        <a href="/missions">Voir les missions</a>
      </button>
      

      {/* Répartition du temps */}
      <section>
        <h2>Répartition du temps</h2>

        <p>
          Intermittence :{" "}
          {dashboard.repartition_temps.intermittence} %
        </p>

        <p>
          Freelance :{" "}
          {dashboard.repartition_temps.freelance} %
        </p>
      </section>

      {/* Intermittence */}
      <section>
        <h2>Intermittence</h2>

        <p>Heures sur les 12 mois glissants</p>

        <p>
          {dashboard.intermittence.heures} h /{" "}
          {dashboard.intermittence.seuil} h
        </p>

        <progress
          value={dashboard.intermittence.progression}
          max="100"
        />

        <span>
          {" "}
          {dashboard.intermittence.progression} %
        </span>

        <p>
          {dashboard.intermittence.heures_restantes} h restantes
        </p>
      </section>

      {/* Freelance */}
      <section>
        <h2>CA Freelance</h2>

        {Object.entries(
          dashboard.freelance.ca_par_mois
        ).map(([mois, ca]) => (
          <p key={mois}>
            {mois} : {ca} € HT
          </p>
        ))}
      </section>

      <button onClick={logout}>
        Déconnexion
      </button>
    </div>
  );
}

export default Dashboard;