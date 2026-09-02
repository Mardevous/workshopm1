import api from "./api";

// Liste + filtre
export const getPortfolioProjects = async (tag = "") => {
  const params = {};

  if (tag) {
    params.tag = tag;
  }

  const response = await api.get("/portfolio", { params });

  return response.data;
};

// Un projet
export const getPortfolioProjectById = async (id) => {
  const response = await api.get(`/portfolio/${id}`);

  return response.data;
};

// Créer
export const createPortfolioProject = async (data) => {
  const response = await api.post("/portfolio", data);

  return response.data;
};

// Modifier
export const updatePortfolioProject = async (id, data) => {
  const response = await api.patch(`/portfolio/${id}`, data);

  return response.data;
};

// Supprimer
export const deletePortfolioProject = async (id) => {
  const response = await api.delete(`/portfolio/${id}`);

  return response.data;
};