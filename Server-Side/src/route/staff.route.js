
import express from "express";

import {
  createStaffController,
  getAllStaffController,
  getStaffByIdController,
  getStaffByDirectorateController,
  updateStaffController,
  updateStaffRoleController,
  updateStaffStatusController,
  deleteStaffController,
} from "../controller/staff.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import { superAdminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.post("/", superAdminOnly, createStaffController);

router.get("/", getAllStaffController);

// Get staff belonging to a directorate
router.get(
  "/directorate/:directorateId",
  getStaffByDirectorateController
);


router.get("/:id", getStaffByIdController);

// Update staff information
router.put("/:id", superAdminOnly, updateStaffController);


router.patch("/:id/role", superAdminOnly, updateStaffRoleController);


router.patch("/:id/status", superAdminOnly, updateStaffStatusController);


router.delete("/:id", superAdminOnly, deleteStaffController);

export default router;