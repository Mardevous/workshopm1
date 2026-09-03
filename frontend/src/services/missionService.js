import api from "./api";

// Récupérer les missions
export const getMissions = async (
  type = "",
  statut = ""
) => {
  const params = {};

  // Ajouter les filtres
  if (type) params.type = type;
  if (statut) params.statut = statut;

  const response = await api.get("/missions", {
    params,
  });

  return response.data;
};

// Récupérer une mission
export const getMissionById = async (id) => {
  const response = await api.get(`/missions/${id}`);

  return response.data;
};

// Créer une mission
export const createMission = async (data) => {
  const response = await api.post("/missions", data);

  return response.data;
};

// Modifier une mission
export const updateMission = async (id, data) => {
  const response = await api.patch(
    `/missions/${id}`,
    data
  );

  return response.data;
};

// Supprimer une mission
export const deleteMission = async (id) => {
  const response = await api.delete(
    `/missions/${id}`
  );

  return response.data;
};

// Générer le PDF
export const generateMissionPdf = async (id) => {
  const response = await api.get(
    `/missions/${id}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};