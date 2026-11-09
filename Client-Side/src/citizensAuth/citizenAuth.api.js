import axios from "axios";

const citizenApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

citizenApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("sst_citizen_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerCitizen = async (citizenData) => {
  const response = await citizenApi.post("/api/citizens/register", citizenData);
  return response.data;
};

export const loginCitizen = async (credentials) => {
  const response = await citizenApi.post("/api/citizens/login", credentials);
  return response.data;
};

export const getCitizenProfile = async () => {
  const response = await citizenApi.get("/api/citizens/me");
  return response.data;
};

export const getCitizenDirectorates = async () => {
  const response = await citizenApi.get("/api/citizens/directorates");
  return response.data;
};

export const getMyServiceCases = async (caseType) => {
  const response = await citizenApi.get("/api/service-cases/mine", {
    params: { caseType },
  });
  return response.data;
};

export const createCitizenServiceCase = async (caseType, caseData) => {
  const endpoint =
    caseType === "complaint" ? "/api/complaints" : "/api/service-requests";
  const response = await citizenApi.post(endpoint, caseData);
  return response.data;
};
