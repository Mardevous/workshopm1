import api from "./api";

// Récupérer les données du tableau de bord
export const getDashboard = async () => {
  const response = await api.get(
    "/dashboard"
  );

  return response.data;
};

// Modifier les paramètres de calcul
export const updateDashboardConfiguration =
  async (
    seuilHeures,
    heuresParJour
  ) => {
    const response = await api.patch(
      "/dashboard/configuration",
      {
        seuil_heures: Number(
          seuilHeures
        ),
        heures_par_jour: Number(
          heuresParJour
        ),
      }
    );

    return response.data;
  };