import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const generateToken = (admin) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured");
  }

  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      tokenType: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const registerAdmin = async (adminData) => {
  const { name, email, password } = adminData;
  const adminCount = await Admin.countDocuments();
  const role = adminCount === 0 ? "superadmin" : adminData.role;

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    throw new Error("Admin with this email already exists");
  }

  const admin = new Admin({
    name,
    email,
    password,
    role: role || "admin",
  });

  await admin.save();

  const adminObject = admin.toObject();
  delete adminObject.password;

  return {
    admin: adminObject,
    token: generateToken(admin),
  };
};

export const loginAdmin = async ({ email, password }) => {
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const adminObject = admin.toObject();
    delete adminObject.password;

    return {
      admin: adminObject,
      token: generateToken(admin),
    };
  } catch (error) {
    throw new Error("Error logging in admin: " + error.message);
  }
};

export const getAdminByEmail = async (email) => {
  try {
    return await Admin.findOne({ email });
  } catch (error) {
    throw new Error("Error fetching admin: " + error.message);
  }
};

export const getAllAdmins = async () => {
  try {
    return await Admin.find().select('-password').lean();
  } catch (error) {
    throw new Error("Error fetching admins: " + error.message);
  }
};

export const deleteAdminById = async (adminId) => {
  try {
    const deleted = await Admin.findByIdAndDelete(adminId).select('-password');
    if (!deleted) {
      throw new Error('Admin not found');
    }
    return deleted;
  } catch (error) {
    throw new Error("Error deleting admin: " + error.message);
  }
};


export const changePassword = async (adminId, currentPassword, newPassword) => {
  const admin = await Admin.findById(adminId);

  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await admin.matchPassword(currentPassword);

  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  admin.password = newPassword;

  await admin.save({ validateModifiedOnly: true });

  return {
    message: "Password changed successfully",
  };
};

export const forgotPassword = async (email) => {
  const response = {
    message: "If a super admin account exists for that email, a reset link will be sent.",
  };
  const admin = await Admin.findOne({ email, role: "superadmin" });

  if (!admin) {
    return response;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL;
  if (!clientUrl && process.env.NODE_ENV === "production") {
    const error = new Error("CLIENT_URL must be configured in production.");
    error.statusCode = 503;
    throw error;
  }

  const smtpValues = [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS];
  const smtpConfigured = smtpValues.every(Boolean);
  const smtpUnconfigured = smtpValues.every((value) => !value);
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (!smtpConfigured && !(smtpUnconfigured && isDevelopment)) {
    const error = new Error(
      "Password reset email is not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS."
    );
    error.statusCode = 503;
    throw error;
  }

  let transporter;
  if (smtpConfigured) {
    const port = Number(SMTP_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      const error = new Error("SMTP_PORT must be a valid port number.");
      error.statusCode = 503;
      throw error;
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetUrl = new URL(
    "/admin/reset-password",
    clientUrl || "http://localhost:5173"
  );
  resetUrl.searchParams.set("token", resetToken);

  admin.resetPasswordToken = hashedToken;
  admin.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
  await admin.save();

  if (!transporter) {
    console.info(`Development password reset link: ${resetUrl.toString()}`);
    return response;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || SMTP_USER,
      to: admin.email,
      subject: "Reset your Shaggar admin password",
      text: `Use this link to reset your password within one hour: ${resetUrl.toString()}`,
      html: `<p>Use the link below to reset your password. It expires in one hour.</p><p><a href="${resetUrl.toString()}">Reset password</a></p>`,
    });
  } catch (error) {
    admin.resetPasswordToken = null;
    admin.resetPasswordExpire = null;
    await admin.save();
    console.error("Failed to send password reset email:", error);
    const emailError = new Error(
      "Unable to send the password reset email. Check the SMTP configuration."
    );
    emailError.statusCode = 503;
    throw emailError;
  }

  return response;
};

export const resetPassword = async (token, password) => {
  if (typeof token !== "string" || !token || typeof password !== "string" || password.length < 8) {
    const error = new Error("A valid reset token and a password of at least 8 characters are required.");
    error.statusCode = 400;
    throw error;
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const admin = await Admin.findOne({
    role: "superadmin",
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });

  if (!admin) {
    const error = new Error("This password reset link is invalid or has expired.");
    error.statusCode = 400;
    throw error;
  }

  admin.password = password;
  admin.resetPasswordToken = null;
  admin.resetPasswordExpire = null;
  await admin.save();

  return { message: "Password reset successfully. You can now sign in." };
};