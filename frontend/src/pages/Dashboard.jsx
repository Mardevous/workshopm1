import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  // Données du tableau de bord
  const [dashboard, setDashboard] = useState(null);

  // État du chargement
  const [loading, setLoading] = useState(true);

  // Message d'erreur
  const [error, setError] = useState("");

  // Charger les données au démarrage
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Récupérer les données
        const response = await api.get("/dashboard");

        setDashboard(response.data);
      } catch (error) {
        // Afficher l'erreur
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

  // Déconnecter l'utilisateur
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Calculer le CA total
  const totalCaFreelance = Object.values(
    dashboard?.freelance?.ca_par_mois || {}
  ).reduce(
    (total, montant) =>
      total + Number(montant || 0),
    0
  );

  // Formater le mois en français
  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      1
    );

    return date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  // Affichage pendant le chargement
  if (loading) {
    return <p>Chargement...</p>;
  }

  // Affichage en cas d'erreur
  if (error) {
    return <p>{error}</p>;
  }

  // Affichage sans données
  if (!dashboard) {
    return <p>Aucune donnée disponible.</p>;
  }

  // Pourcentage d'intermittence
  const intermittencePercentage =
    dashboard.repartition_temps?.intermittence || 0;

  // Pourcentage de freelance
  const freelancePercentage =
    dashboard.repartition_temps?.freelance || 0;

  return (
    <main className="dashboard-page">
      {/* En-tête */}
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>

        <button
          type="button"
          onClick={logout}
        >
          Déconnexion
        </button>
      </header>

      {/* Liens vers les pages */}
      <nav className="dashboard-buttons">
        <Link
          className="dashboard-link-button"
          to="/missions"
        >
          Voir les missions
        </Link>

        <Link
          className="dashboard-link-button"
          to="/portfolio"
        >
          Voir le portfolio
        </Link>

        <Link
          className="dashboard-link-button"
          to="/calendar"
        >
          Voir le calendrier
        </Link>

        <Link
          className="dashboard-link-button"
          to="/documents"
        >
          Voir les documents
        </Link>
      </nav>

      {/* Répartition du temps */}
      <section className="dashboard-time-section">
        <h2>Répartition du temps</h2>

        <div className="dashboard-time-content">
          {/* Légende */}
          <div className="dashboard-percentages">
            <p>
              <span className="legend-dot legend-intermittence" />

              Intermittence :
              <strong>
                {" "}
                {intermittencePercentage} %
              </strong>
            </p>

            <p>
              <span className="legend-dot legend-freelance" />

              Freelance :
              <strong>
                {" "}
                {freelancePercentage} %
              </strong>
            </p>
          </div>

          {/* Cercles des pourcentages */}
          <div className="dashboard-circles">
            <div
              className="percentage-circle"
              style={{
                "--percentage":
                  intermittencePercentage,
                "--circle-color": "#4285f4",
              }}
            >
              <div className="percentage-circle-content">
                <strong>
                  {intermittencePercentage} %
                </strong>

                <span>Intermittence</span>

                <small>
                  {dashboard.intermittence.heures} h
                </small>
              </div>
            </div>

            <div
              className="percentage-circle"
              style={{
                "--percentage":
                  freelancePercentage,
                "--circle-color": "#f5a623",
              }}
            >
              <div className="percentage-circle-content">
                <strong>
                  {freelancePercentage} %
                </strong>

                <span>Freelance</span>

                <small>
                  {totalCaFreelance.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  €
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Détails */}
      <div className="dashboard-details">
        {/* Informations sur l'intermittence */}
        <section className="dashboard-card intermittence-card">
          <h2>Intermittence</h2>

          <p className="dashboard-description">
            Heures sur les 12 mois glissants
          </p>

          <p className="dashboard-main-value">
            {dashboard.intermittence.heures} h
            <span>
              {" "}
              / {dashboard.intermittence.seuil} h
            </span>
          </p>

          {/* Barre de progression */}
          <div className="progress-row">
            <progress
              value={
                dashboard.intermittence.progression
              }
              max="100"
            />

            <strong>
              {dashboard.intermittence.progression} %
            </strong>
          </div>

          <p className="remaining-hours">
            {dashboard.intermittence.heures_restantes}{" "}
            h restantes
          </p>
        </section>

        {/* Chiffre d'affaires freelance */}
        <section className="dashboard-card freelance-card">
          <div className="freelance-card-header">
            <div>
              <h2>CA Freelance</h2>

              <p className="dashboard-description">
                Chiffre d'affaires par mois
              </p>
            </div>

            {/* CA total */}
            <div className="freelance-total">
              <span>Total</span>

              <strong>
                {totalCaFreelance.toLocaleString(
                  "fr-FR"
                )}{" "}
                € HT
              </strong>
            </div>
          </div>

          {/* Vérifier si la liste est vide */}
          {Object.keys(
            dashboard.freelance.ca_par_mois
          ).length === 0 ? (
            <p>Aucun chiffre d'affaires enregistré.</p>
          ) : (
            // Liste du CA par mois
            <div className="freelance-month-list">
              {Object.entries(
                dashboard.freelance.ca_par_mois
              )
                // Trier du plus récent au plus ancien
                .sort(([monthA], [monthB]) =>
                  monthB.localeCompare(monthA)
                )
                .map(([month, ca]) => (
                  <div
                    className="freelance-month-row"
                    key={month}
                  >
                    <span className="freelance-month">
                      {formatMonth(month)}
                    </span>

                    <strong>
                      {Number(ca).toLocaleString(
                        "fr-FR"
                      )}{" "}
                      € HT
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;