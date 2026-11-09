
import Staff from "../models/staff.model.js";

// 1. Create a new staff member
export const createStaff = async (staffData) => {
  const existingStaff = await Staff.findOne({
    email: staffData.email,
  });

  if (existingStaff) {
    throw new Error("A staff member with this email already exists");
  }

  const staff = await Staff.create(staffData);

  // Return staff data without the password
  return Staff.findById(staff._id);
};

// 2. Get all staff members
export const getAllStaff = async () => {
  return await Staff.find()
    .populate("directorateId", "name code")
    .sort({ createdAt: -1 });
};

// 3. Get one staff member by ID
export const getStaffById = async (staffId) => {
  const staff = await Staff.findById(staffId)
    .populate("directorateId", "name code");

  if (!staff) {
    throw new Error("Staff member not found");
  }

  return staff;
};

// 4. Get staff members belonging to a directorate
export const getStaffByDirectorate = async (directorateId) => {
  return await Staff.find({ directorateId })
    .populate("directorateId", "name code")
    .sort({ name: 1 });
};

// 5. Update a staff member
export const updateStaff = async (staffId, updateData) => {
  const staff = await Staff.findById(staffId);

  if (!staff) {
    throw new Error("Staff member not found");
  }

  // Prevent changing sensitive fields through general updates
  delete updateData.password;
  delete updateData.role;
  delete updateData.email;

  Object.assign(staff, updateData);

  await staff.save();

  return Staff.findById(staff._id)
    .populate("directorateId", "name code");
};

// 6. Change a staff member's role
export const updateStaffRole = async (staffId, role) => {
  const allowedRoles = [
    "admin",
    "director",
    "manager",
    "staff",
  ];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid staff role");
  }

  const staff = await Staff.findById(staffId);

  if (!staff) {
    throw new Error("Staff member not found");
  }

  staff.role = role;

  await staff.save();

  return Staff.findById(staff._id)
    .populate("directorateId", "name code");
};

// 7. Activate or deactivate a staff account
export const updateStaffStatus = async (staffId, isActive) => {
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be true or false");
  }

  const staff = await Staff.findByIdAndUpdate(
    staffId,
    { isActive },
    { returnDocument: "after", runValidators: true }
  )
    .select("-password")
    .populate("directorateId", "name code");

  if (!staff) {
    throw new Error("Staff member not found");
  }

  return staff;
};

// 8. Delete a staff member
export const deleteStaff = async (staffId) => {
  const staff = await Staff.findByIdAndDelete(staffId);

  if (!staff) {
    throw new Error("Staff member not found");
  }

  return { message: "Staff member deleted successfully" };
};