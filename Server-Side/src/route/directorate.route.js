
import express from "express";

import {
  createDirectorateController,
  getAllDirectoratesController,
  getDirectorateByIdController,
  updateDirectorateController,
  deactivateDirectorateController,
} from "../controller/directorate.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import { superAdminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

// Create a directorate
router.post("/", protect, isAdmin, superAdminOnly, createDirectorateController);

// Get all directorates
router.get("/", protect, isAdmin, getAllDirectoratesController);

// Get one directorate by ID
router.get("/:id", protect, isAdmin, getDirectorateByIdController);

// Update a directorate
router.patch("/:id", protect, isAdmin, superAdminOnly, updateDirectorateController);

// Deactivate a directorate
router.patch("/:id/deactivate", protect, isAdmin, superAdminOnly, deactivateDirectorateController);

export default router;