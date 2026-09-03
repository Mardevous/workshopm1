import api from "./api";

// Récupérer les projets
export const getPortfolioProjects = async (tag = "") => {
  const params = {};

  // Ajouter le filtre
  if (tag) {
    params.tag = tag;
  }

  const response = await api.get("/portfolio", {
    params,
  });

  return response.data;
};

// Récupérer un projet
export const getPortfolioProjectById = async (id) => {
  const response = await api.get(`/portfolio/${id}`);

  return response.data;
};

// Créer un projet
export const createPortfolioProject = async (data) => {
  const response = await api.post("/portfolio", data);

  return response.data;
};

// Modifier un projet
export const updatePortfolioProject = async (
  id,
  data
) => {
  const response = await api.patch(
    `/portfolio/${id}`,
    data
  );

  return response.data;
};

// Supprimer un projet
export const deletePortfolioProject = async (id) => {
  const response = await api.delete(`/portfolio/${id}`);

  return response.data;
};