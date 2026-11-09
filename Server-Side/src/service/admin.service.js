import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import crypto from "crypto";

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
  try{
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error("Admin not found");
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await admin.save();
  }
  catch (error) {
    throw new Error("Error in forgot password: " + error.message);
  }
}