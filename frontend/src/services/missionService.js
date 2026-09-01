import api from "./api";

// 获取 missions，可带筛选
export const getMissions = async (type = "", statut = "") => {
  const params = {};

  if (type) params.type = type;
  if (statut) params.statut = statut;

  const response = await api.get("/missions", {
    params,
  });

  return response.data;
};

// 获取一条 mission
export const getMissionById = async (id) => {
  const response = await api.get(`/missions/${id}`);
  return response.data;
};

// 新建 mission
export const createMission = async (data) => {
  const response = await api.post("/missions", data);
  return response.data;
};

// 修改 mission
export const updateMission = async (id, data) => {
  const response = await api.patch(`/missions/${id}`, data);
  return response.data;
};

// 删除 mission
export const deleteMission = async (id) => {
  const response = await api.delete(`/missions/${id}`);
  return response.data;
};