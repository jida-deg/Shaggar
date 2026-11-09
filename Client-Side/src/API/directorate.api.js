import api from "./axios";

export const getAllDirectorates = async () => {
  const response = await api.get("/api/directorates");
  return response.data;
};

export const createDirectorate = async (directorate) => {
  const response = await api.post("/api/directorates", directorate);
  return response.data;
};

export const editDirectorate = async (id, updatedDirectorate) => {
  const response = await api.patch(
    `/api/directorates/${id}`,
    updatedDirectorate
  );
  return response.data;
};

export const getDirectorateById = async (id) => {
  const response = await api.get(`/api/directorates/${id}`);
  return response.data;
};
