import api from "./api";

// Liste + filtre
export const getDocuments = async (tag = "") => {
  const params = {};

  if (tag) {
    params.tag = tag;
  }

  const response = await api.get("/documents", { params });

  return response.data;
};

// 删除 mission
export const deleteMission = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};