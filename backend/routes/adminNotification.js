// backend/routes/adminNotification.js
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getAdminNotifications,
  getAdminUnreadCount,
  markAllAdminRead,
  markOneAdminRead,
  deleteAdminNotification,
} from "../controllers/adminNotification.js";

const router = express.Router();

router.get("/", verifyToken, getAdminNotifications);
router.get("/unread-count", verifyToken, getAdminUnreadCount);
router.post("/mark-read", verifyToken, markAllAdminRead);
router.post("/:id/read", verifyToken, markOneAdminRead);
router.delete("/:id", verifyToken, deleteAdminNotification);

export default router;
