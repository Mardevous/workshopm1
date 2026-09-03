import api from "./api";

// 获取文档列表，并支持按分类和 Mission 筛选
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

// 上传文档
export const addDocument = async (formData) => {
  const response = await api.post(
    "/documents",
    formData
  );

  return response.data;
};

// 下载文档
export const downloadDocument = async (id) => {
  const response = await api.get(
    `/documents/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

// 删除文档
export const deleteDocument = async (id) => {
  const response = await api.delete(
    `/documents/${id}`
  );

  return response.data;
};

export const viewDocument = async (id) => {
  const response = await api.get(
    `/documents/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};