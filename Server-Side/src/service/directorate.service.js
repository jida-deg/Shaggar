
import Directorate from "../models/directorate.model.js";
import Admin from "../models/admin.model.js";

// Create a directorate
export const createDirectorate = async (data) => {
  const { name, code, description, managerId } = data;

  if (!name?.trim() || !code?.trim() || !description?.trim() || !managerId) {
    const error = new Error("All directorate fields are required.");
    error.statusCode = 400;
    throw error;
  }

  const existingDirectorate = await Directorate.findOne({
    code: code.trim().toUpperCase(),
  });

  if (existingDirectorate) {
    const error = new Error("A directorate with this code already exists.");
    error.statusCode = 409;
    throw error;
  }

  const manager = await Admin.findById(managerId);

  if (!manager || manager.isActive === false) {
    const error = new Error("The selected manager does not exist or is inactive.");
    error.statusCode = 400;
    throw error;
  }

  return await Directorate.create({
    name: name.trim(),
    code: code.trim().toUpperCase(),
    description: description.trim(),
    managerId,
  });
};

// Get all directorates
export const getAllDirectorates = async () => {
  return await Directorate.find()
    .populate("managerId", "name email role")
    .sort({ createdAt: -1 });
};

// Get one directorate by ID
export const getDirectorateById = async (id) => {
  const directorate = await Directorate.findById(id)
    .populate("managerId", "name email role");

  if (!directorate) {
    const error = new Error("Directorate not found.");
    error.statusCode = 404;
    throw error;
  }

  return directorate;
};

// Update a directorate
export const updateDirectorate = async (id, data) => {
  const directorate = await Directorate.findById(id);

  if (!directorate) {
    const error = new Error("Directorate not found.");
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = ["name", "code", "description", "managerId"];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (
        typeof data[field] === "string" &&
        !data[field].trim()
      ) {
        const error = new Error(`${field} cannot be empty.`);
        error.statusCode = 400;
        throw error;
      }

      directorate[field] =
        field === "code" && typeof data[field] === "string"
          ? data[field].trim().toUpperCase()
          : typeof data[field] === "string"
            ? data[field].trim()
            : data[field];
    }
  }

  if (data.managerId !== undefined) {
    const manager = await Admin.findById(data.managerId);

    if (!manager || manager.isActive === false) {
      const error = new Error("The selected manager does not exist or is inactive.");
      error.statusCode = 400;
      throw error;
    }
  }

  return await directorate.save();
};

// Deactivate a directorate instead of permanently deleting it
export const deactivateDirectorate = async (id) => {
  const directorate = await Directorate.findById(id);

  if (!directorate) {
    const error = new Error("Directorate not found.");
    error.statusCode = 404;
    throw error;
  }

  directorate.isActive = false;

  return await directorate.save();
};

