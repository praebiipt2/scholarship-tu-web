import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
  getScholarship,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from "../controllers/scholarshipManagement.js";

import { getStudent , getStudentInfo } from "../controllers/studentManagement.js";

import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsFile,
} from "../controllers/NewsManagement.js";

import { upload, uploadFields } from "../uploadFile.js";
import { getAdminDashboard } from "../controllers/adminDashboard.js";

// ✅ เพิ่ม import controller การแจ้งเตือนเจ้าหน้าที่
import {
  getAdminNotifications,
  getAdminUnreadCount,
  markAllAdminRead,
  markOneAdminRead,
  deleteAdminNotification,
} from "../controllers/adminNotification.js";

const router = express.Router();

/* จัดการนักศึกษา */
router.get("/student", getStudent);

/* จัดการทุน */
router.get("/scholarship", getScholarship);
router.post("/scholarship", uploadFields, createScholarship);
router.patch("/scholarship/:id", uploadFields, updateScholarship);
router.delete("/scholarship", deleteScholarship);

/* จัดการข่าว */
router.get("/news", getNews);
router.post("/news", uploadNewsFile, createNews);
router.patch("/news/:id", uploadNewsFile, updateNews);
router.delete("/news", deleteNews);

/* Dashboard ผู้ดูแล */
router.get("/dashboard", verifyToken, getAdminDashboard);

/* ───────── การแจ้งเตือนของเจ้าหน้าที่ ───────── */

// ดึง list การแจ้งเตือน
router.get("/notifications", verifyToken, getAdminNotifications);

// ดึงจำนวนที่ยังไม่อ่าน (ไว้ใช้แสดง badge)
router.get(
  "/notifications/unread-count",
  verifyToken,
  getAdminUnreadCount
);

// mark ทั้งหมดว่าอ่านแล้ว
router.post(
  "/notifications/mark-all-read",
  verifyToken,
  markAllAdminRead
);

// mark แจ้งเตือน 1 อันว่าอ่านแล้ว
router.post(
  "/notifications/:id/read",
  verifyToken,
  markOneAdminRead
);

// ลบแจ้งเตือน 1 อัน
router.delete(
  "/notifications/:id",
  verifyToken,
  deleteAdminNotification
);

router.get("/student/:id/full",getStudentInfo)

export default router;
