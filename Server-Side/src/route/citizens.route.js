import {createCitizenController, getCitizenByEmailController,
     getCitizenByIdController, loginCitizenController,
     getMyCitizenProfileController, getAllCitizensController,
     getCitizenDirectoratesController, logoutCitizenController} from "../controller/citizens.controller.js";
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import { protectCitizen } from "../middleware/citizenAuth.middleware.js";
import { superAdminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", createCitizenController);
router.post("/login", loginCitizenController);
router.post("/logout", logoutCitizenController);
router.get("/me", protectCitizen, getMyCitizenProfileController);
router.get("/directorates", protectCitizen, getCitizenDirectoratesController);
router.get("/", protect, isAdmin, superAdminOnly, getAllCitizensController);
router.get("/email/:email", protect, isAdmin, superAdminOnly, getCitizenByEmailController);
router.get("/:id", protect, isAdmin, superAdminOnly, getCitizenByIdController);
export default router;