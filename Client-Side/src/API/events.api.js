import api from "./axios";

export const createEvent = async (event) => {
  const formData = new FormData();

  formData.append("title", event.title);
  formData.append("description", event.description);
  formData.append("eventDate", event.date);

  if (event.file) {
    formData.append("file", event.file);
  }

  const response = await api.post("/event/create", formData);

  return response.data;
};
export const deleteEventApi = async (id) => {
    const res = await api.delete(`/event/${id}`);
    return res.data;
};