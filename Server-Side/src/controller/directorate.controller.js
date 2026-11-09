
import {createDirectorate, getAllDirectorates, getDirectorateById, updateDirectorate, deactivateDirectorate} from "../service/directorate.service.js";

// Create directorate
export const createDirectorateController = async (req, res) => {
  try {
    const directorate = await createDirectorate(req.body);

    return res.status(201).json({
      success: true,
      message: "Directorate created successfully.",
      data: directorate,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.code === 11000
          ? "A directorate with this code already exists."
          : error.message || "Failed to create directorate.",
    });
  }
};

// Get all directorates
export const getAllDirectoratesController = async (req, res) => {
  try {
    const directorates = await getAllDirectorates();

    return res.status(200).json({
      success: true,
      count: directorates.length,
      data: directorates,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve directorates.",
    });
  }
};

// Get one directorate
export const getDirectorateByIdController = async (req, res) => {
  try {
    const directorate = await getDirectorateById(req.params.id);

    return res.status(200).json({
      success: true,
      data: directorate,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve directorate.",
    });
  }
};

// Update directorate
export const updateDirectorateController = async (req, res) => {
  try {
    const directorate = await updateDirectorate(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Directorate updated successfully.",
      data: directorate,
    });
  } catch (error) {
    return res.status(
      error.code === 11000 ? 409 : error.statusCode || 500
    ).json({
      success: false,
      message:
        error.code === 11000
          ? "A directorate with this code already exists."
          : error.message || "Failed to update directorate.",
    });
  }
};

// Deactivate directorate
export const deactivateDirectorateController = async (req, res) => {
  try {
    const directorate = await deactivateDirectorate(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Directorate deactivated successfully.",
      data: directorate,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to deactivate directorate.",
    });
  }
};