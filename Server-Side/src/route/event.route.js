
import express from "express";
import { createEventController,getEventByTitleController, getAllEventsController, updateEventController, deleteEventController } from "../controller/event.controller.js";
import isAdmin from "../middleware/admin.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";
const eventRouter = express.Router();

// Public route - anyone can view events
eventRouter.get("/all", getAllEventsController);
eventRouter.get("/title/:title", getEventByTitleController);
// Protected routes - only admins can create, update, delete
eventRouter.post(
  "/create",
  protect,
  isAdmin,
  upload.fields([{ name: "files", maxCount: 10 }, { name: "file", maxCount: 1 }]),
  createEventController
);

eventRouter.put(
  "/:id",
  protect,
  isAdmin,
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.startsWith("multipart/form-data")) {
      return upload.fields([{ name: "files", maxCount: 10 }, { name: "file", maxCount: 1 }])(req, res, next);
    }
    next();
  },
  updateEventController
);

eventRouter.delete("/:id", protect, isAdmin, deleteEventController);
export default eventRouter;