
import api from "./axios.js";

export const createStaff = async (staffData) => {
  const response = await api.post("/api/staff", staffData);
  return response.data;
};
export const getAllStaff = async () => {
  const response = await api.get("/api/staff");
  return response.data;
};

export const getStaffById = async (id) => {
  const response = await api.get(`/api/staff/${id}`);
  return response.data;
};

export const getStaffByDirectorate = async (directorateId) => {
  const response = await api.get(`/api/staff/directorate/${directorateId}`);
  return response.data;
};

export const updateStaff = async (id, updatedData) => {
  const response = await api.put(`/api/staff/${id}`, updatedData);
  return response.data;
};
export const deleteStaff = async (id) => {
  const response = await api.delete(`/api/staff/${id}`);
  return response.data;
};