import {createWorkPlanController, getAllWorkPlansController, 
    getWorkPlanByIdController, getWorkPlansByPeriodController, 
    updateWorkPlanController, deleteWorkPlanController} 
from "../controller/workPlan.controller.js";

import express from "express";
import isAdmin from "../middleware/admin.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protect, isAdmin);

router.post("/", createWorkPlanController);
router.get("/", getAllWorkPlansController);
router.get("/period", getWorkPlansByPeriodController);
router.get("/:id", getWorkPlanByIdController);
router.put("/:id", updateWorkPlanController);
router.delete("/:id", deleteWorkPlanController);


export default router;