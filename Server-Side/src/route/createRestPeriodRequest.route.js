import {
  createRestPeriodRequestController,
  decideRestPeriodRequestController,
  getAllRestPeriodRequestsController,
  getRestPeriodRequestByIdController,
  getMyRestPeriodRequestsController,
} from "../controller/restPeriodRequest.controller.js";

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import { superAdminOnly } from "../middleware/role.middleware.js";
const router = express.Router();

router.use(protect, isAdmin);
router.post("/", createRestPeriodRequestController);
router.get("/my", getMyRestPeriodRequestsController);
router.get("/:id", getRestPeriodRequestByIdController);
router.patch("/:id/decision", superAdminOnly, decideRestPeriodRequestController);
router.get("/", superAdminOnly, getAllRestPeriodRequestsController);
export default router;