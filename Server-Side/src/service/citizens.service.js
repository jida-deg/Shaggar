import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Citizen from "../models/citizens.model.js";
import Directorate from "../models/directorate.model.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured");
  }

  return process.env.JWT_SECRET;
};

const generateCitizenToken = (citizen) =>
  jwt.sign(
    { id: citizen._id, tokenType: "citizen" },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

export const createCitizen = async (citizenData) => {
  const jwtSecret = getJwtSecret();
  const citizen = new Citizen({
    fullName: citizenData.fullName,
    email: citizenData.email,
    phone: citizenData.phone,
    password: citizenData.password,
    adress: citizenData.adress,
  });

  await citizen.save();
  return {
    citizen,
    token: jwt.sign(
      { id: citizen._id, tokenType: "citizen" },
      jwtSecret,
      { expiresIn: "7d" }
    ),
  };
};

export const getCitizenByEmail = async (email) => {
  return Citizen.findOne({ email: email.trim().toLowerCase() });
};

export const getCitizenById = async (id) => {
  return Citizen.findById(id);
};

export const getAllCitizens = async () => {
  return Citizen.find()
    .select("fullName email phone isActive isVerified createdAt")
    .sort({ createdAt: -1 });
};

export const getCitizenDirectorates = async () => {
  return Directorate.find({ isActive: { $ne: false } })
    .select("name code description")
    .sort({ name: 1 });
};

export const loginCitizen = async ({ email, phone, identifier, password }) => {
  const loginValue = (identifier ?? email ?? phone)?.trim();
  if (!loginValue || !password) {
    const error = new Error("Email or phone number and password are required");
    error.statusCode = 400;
    throw error;
  }

  const lookup = loginValue.includes("@")
    ? { email: loginValue.toLowerCase() }
    : { phone: loginValue };
  const citizen = await Citizen.findOne(lookup).select("+password");

  if (
    !citizen ||
    !citizen.isActive ||
    !(await bcrypt.compare(password, citizen.password))
  ) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    citizen,
    token: generateCitizenToken(citizen),
  };
};