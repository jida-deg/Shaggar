import {createWorkTaskController, getAllWorkTasksController,
     getWorkTaskByIdController, updateWorkTaskController, 
     deleteWorkTaskController} from "../controller/workTask.controller.js";
     

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import {superAdminOnly} from "../middleware/role.middleware.js";
 const router = express.Router();
router.use(protect, isAdmin, superAdminOnly);
router.post("/", createWorkTaskController);
router.get("/", getAllWorkTasksController);
router.get("/:id", getWorkTaskByIdController);
router.put("/:id", updateWorkTaskController);
router.delete("/:id", deleteWorkTaskController);
export default router;