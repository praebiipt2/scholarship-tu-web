// backend/routes/notification.js
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyRoleStd from "../middleware/verifyRoleStd.js";

import {
  getStudentNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
  deleteStudentNotification,
} from "../controllers/notification.js";

const router = express.Router();

/**
 ดึง list แจ้งเตือนของนักศึกษาที่ล็อกอินอยู่
 GET /api/notifications/student
 */
router.get(
  "/student",
  verifyToken,
  verifyRoleStd,
  getStudentNotifications
);

/**
 จำนวนแจ้งเตือนที่ยังไม่อ่าน (ใช้ในหน้า notification เอง)
 GET /api/notifications/student/unread-count
 */
router.get(
  "/student/unread-count",
  verifyToken,
  verifyRoleStd,
  getUnreadCount
);

/**
  สำหรับ Navbar ตอนนี้มันเรียก /api/notifications/unread-count
 เลยเพิ่ม route ตัวนี้เข้าไป
 GET /api/notifications/unread-count
 */
router.get(
  "/unread-count",
  verifyToken,
  verifyRoleStd,
  getUnreadCount
);

/**
 กดปุ่ม "อ่านทั้งหมดแล้ว"
 POST /api/notifications/student/mark-all-read
 */
router.post(
  "/student/mark-all-read",
  verifyToken,
  verifyRoleStd,
  markAllRead
);

/**
 คลิกการ์ดแจ้งเตือน 1 อัน mark ว่าอ่านแล้ว
 POST /api/notifications/:id/read
 */
router.post(
  "/:id/read",
  verifyToken,
  verifyRoleStd,
  markOneRead
);

/**
 ลบแจ้งเตือนของนักศึกษาคนนั้น 1 อัน
 DELETE /api/notifications/:id
 */
router.delete(
  "/:id",
  verifyToken,
  verifyRoleStd,
  deleteStudentNotification
);

export default router;
