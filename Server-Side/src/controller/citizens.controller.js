import {createCitizen, getCitizenByEmail,
 getCitizenById, loginCitizen, getAllCitizens,
 getCitizenDirectorates} from "../service/citizens.service.js";

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

 export const createCitizenController = async (req, res) => {
  try {
    const result = await createCitizen(req.body);
    res.cookie("citizen_token", result.token, AUTH_COOKIE_OPTIONS);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || (error.code === 11000 ? 409 : 400)).json({
      message: error.code === 11000
        ? "A citizen with this email or phone already exists."
        : error.message,
    });
  }
};

export const loginCitizenController = async (req, res) => {
  try {
    const result = await loginCitizen(req.body);
    res.cookie("citizen_token", result.token, AUTH_COOKIE_OPTIONS);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const logoutCitizenController = (_req, res) => {
  res.clearCookie("citizen_token", { ...AUTH_COOKIE_OPTIONS, maxAge: undefined });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMyCitizenProfileController = async (req, res) => {
  try {
    const citizen = await getCitizenById(req.user.id);
    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }
    res.status(200).json(citizen);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getCitizenByEmailController = async (req, res) => {
  try {
    const citizen = await getCitizenByEmail(req.params.email);
    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }
    res.status(200).json(citizen);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getCitizenByIdController = async (req, res) => {
  try {
    const citizen = await getCitizenById(req.params.id);
    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }
    res.status(200).json(citizen);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getAllCitizensController = async (_req, res) => {
  try {
    const citizens = await getAllCitizens();
    return res.status(200).json({ success: true, count: citizens.length, data: citizens });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getCitizenDirectoratesController = async (_req, res) => {
  try {
    const directorates = await getCitizenDirectorates();
    return res.status(200).json({ success: true, count: directorates.length, data: directorates });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};