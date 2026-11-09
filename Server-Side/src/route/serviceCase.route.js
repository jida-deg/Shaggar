
import { createServiceCaseController, getServiceCaseByIdController,
     getAllServiceCasesController, updateServiceCaseStatusController,
     getMyServiceCasesController } from "../controller/serviceCase.controller.js";

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import { protectCitizen } from "../middleware/citizenAuth.middleware.js";
import { superAdminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protectCitizen, createServiceCaseController);
router.get("/mine", protectCitizen, getMyServiceCasesController);
router.get("/", protect, isAdmin, superAdminOnly, getAllServiceCasesController);
router.get("/:id", protect, isAdmin, superAdminOnly, getServiceCaseByIdController);
router.patch("/:id/status", protect, isAdmin, superAdminOnly, updateServiceCaseStatusController);

export default router;