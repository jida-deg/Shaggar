import {
  createStaff,
  getAllStaff,
  getStaffById,
  getStaffByDirectorate,
  updateStaff,
  updateStaffRole,
  updateStaffStatus,
  deleteStaff,
} from "../service/staff.service.js";

// 1. Create staff
export const createStaffController = async (req, res) => {
  try {
    const staff = await createStaff(req.body);

    return res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      data: staff,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Get all staff
export const getAllStaffController = async (req, res) => {
  try {
    const staff = await getAllStaff();

    return res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Get staff by ID
export const getStaffByIdController = async (req, res) => {
  try {
    const staff = await getStaffById(req.params.id);

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    const statusCode =
      error.name === "CastError" ? 400 :
      error.message === "Staff member not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Get staff by directorate
export const getStaffByDirectorateController = async (req, res) => {
  try {
    const staff = await getStaffByDirectorate(
      req.params.directorateId
    );

    return res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. Update staff information
export const updateStaffController = async (req, res) => {
  try {
    const staff = await updateStaff(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Staff member updated successfully",
      data: staff,
    });
  } catch (error) {
    const statusCode =
      error.name === "CastError" ? 400 :
      error.message === "Staff member not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// 6. Update staff role
export const updateStaffRoleController = async (req, res) => {
  try {
    const { role } = req.body;

    const staff = await updateStaffRole(req.params.id, role);

    return res.status(200).json({
      success: true,
      message: "Staff role updated successfully",
      data: staff,
    });
  } catch (error) {
    const statusCode =
      error.name === "CastError" ? 400 :
      error.message === "Staff member not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// 7. Activate or deactivate staff
export const updateStaffStatusController = async (req, res) => {
  try {
    const { isActive } = req.body;

    const staff = await updateStaffStatus(
      req.params.id,
      isActive
    );

    return res.status(200).json({
      success: true,
      message: "Staff status updated successfully",
      data: staff,
    });
  } catch (error) {
    const statusCode =
      error.name === "CastError" ? 400 :
      error.message === "Staff member not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// 8. Delete staff
export const deleteStaffController = async (req, res) => {
  try {
    const result = await deleteStaff(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode =
      error.name === "CastError" ? 400 :
      error.message === "Staff member not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};