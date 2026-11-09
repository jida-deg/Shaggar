import api from "./axios.js";

export const createRestRequest = async (restRequestData) => {
  const response = await api.post("/api/rest-period-requests", restRequestData);
  return response.data;
};
export const getAllRestRequests = async () => {
  const response = await api.get("/api/rest-period-requests");
  return response.data;
}
export const getRestRequestById = async (id) => {
  const response = await api.get(`/api/rest-requests/${id}`);
  return response.data;
}
export const updateRestRequest = async (id, updatedData) => {
  const response = await api.put(`/api/rest-requests/${id}`, updatedData);
  return response.data;
}
export const deleteRestRequest = async (id) => {
  const response = await api.delete(`/api/rest-requests/${id}`);
  return response.data;
}
