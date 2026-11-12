import { Router } from "express";
import {
    registerAdminController,
    getAdminByEmailController,
    loginAdminController,
    getMeController,
    getAllAdminsController,
    deleteAdminController,
    changePasswordController,
    forgotPasswordController,
    resetPasswordController,
    logoutAdminController,
} from "../controller/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {superAdminOnly} from "../middleware/role.middleware.js";
import Admin from "../models/admin.model.js";

const adminRouter = Router();

const allowFirstSuperAdmin = async (req, res, next) => {
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
        req.body.role = "superadmin";
        return next();
    }

    return protect(req, res, () => superAdminOnly(req, res, next));
};
    
adminRouter.post("/register", allowFirstSuperAdmin, registerAdminController);
adminRouter.post("/register-superadmin", protect, superAdminOnly, registerAdminController);
adminRouter.post("/create-admin", protect, superAdminOnly, registerAdminController);
adminRouter.post("/login", loginAdminController);
adminRouter.post("/logout", logoutAdminController);
adminRouter.get("/me", protect, getMeController);
adminRouter.get("/profile", protect, getMeController);
adminRouter.get("/email/:email", protect, superAdminOnly, getAdminByEmailController);
adminRouter.get("/", protect, superAdminOnly, getAllAdminsController);
adminRouter.delete("/:id", protect, superAdminOnly, deleteAdminController);
adminRouter.put("/change-password", protect, changePasswordController);
adminRouter.post("/forgot-password", forgotPasswordController);
adminRouter.post("/reset-password", resetPasswordController);

export default adminRouter;