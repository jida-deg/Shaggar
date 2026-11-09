import api from "./axios";

export const createWorkplan = async (workplanData) => {
  const response = await api.post("/api/workplans", workplanData);
  return response.data;
}
export const getAllWorkplans = async () => {
  const response = await api.get("/api/workplans");
  return response.data;
}

export const getWorkplanById = async (id) => {
  const response = await api.get(`/api/workplans/${id}`);
  return response.data;
}
export const updateWorkplan = async (id, updatedData) => {
  const response = await api.put(`/api/workplans/${id}`, updatedData);
  return response.data;
}
export const deleteWorkplan = async (id) => {
  const response = await api.delete(`/api/workplans/${id}`);
  return response.data;
}