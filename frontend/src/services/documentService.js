import api from "./api";

// Récupérer les documents
export const getDocuments = async (
  categorie = "",
  missionId = ""
) => {
  const response = await api.get("/documents", {
    params: {
      categorie: categorie || undefined,
      mission_id: missionId || undefined,
    },
  });

  return response.data;
};

// Ajouter un document
export const addDocument = async (formData) => {
  const response = await api.post(
    "/documents",
    formData
  );

  return response.data;
};

// Télécharger un document
export const downloadDocument = async (id) => {
  const response = await api.get(
    `/documents/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

// Supprimer un document
export const deleteDocument = async (id) => {
  const response = await api.delete(
    `/documents/${id}`
  );

  return response.data;
};

// Afficher un document
export const viewDocument = async (id) => {
  const response = await api.get(
    `/documents/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};