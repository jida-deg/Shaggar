import express from "express";
import { getDashboardSummaryController } from "../controller/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/summary", protect, isAdmin, getDashboardSummaryController);

export default router;
