import { registerAdmin, 
  getAdminByEmail, 
  loginAdmin, 
  getAllAdmins, 
  deleteAdminById, 
  changePassword,
  forgotPassword,
  resetPassword } from '../service/admin.service.js';

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const setAdminCookie = (res, token) => {
  res.cookie("admin_token", token, AUTH_COOKIE_OPTIONS);
};

export const registerAdminController = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const admin = await registerAdmin(req.body);
    // admin cookie is set here after successful registration
    setAdminCookie(res, admin.token);

    res.status(201).json(admin);
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const createAdminController = async (req, res) => {
  try {
    const admin = await registerAdmin(req.body);

    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const getAdminByEmailController = async (req, res, next) => {
    try {
        const admin = await getAdminByEmail(req.params.email);
        res.status(200).json(admin);
    } catch (error) {
        next(error);
    }
};

export const loginAdminController = async (req, res, next) => {
    try {
        const result = await loginAdmin(req.body);
        // set the admin cookie after successful login
        setAdminCookie(res, result.token);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const logoutAdminController = (_req, res) => {
  // Clear the admin cookie by setting its maxAge to undefined
  res.clearCookie("admin_token", { ...AUTH_COOKIE_OPTIONS, maxAge: undefined });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMeController = async (req, res) => {
   try {
    const admin = req.user;
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAdminsController = async (req, res, next) => {
  try {
    const admins = await getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminController = async (req, res, next) => {
  try {
    const deletedAdmin = await deleteAdminById(req.params.id);
    res.status(200).json({ message: 'Admin deleted', admin: deletedAdmin });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    await changePassword(req.user._id, currentPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
export const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Email is required." });
    }

    const result = await forgotPassword(email.trim());
    res.status(200).json(result);
  }
  catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


  