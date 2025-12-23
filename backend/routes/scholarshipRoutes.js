// backend/routes/scholarshipRoutes.js
import express from "express";

import { 
  getAllScholarship,
  requestScholarshipInfo,
} from "../controllers/scholarshipCard.js";

import verifyToken from "../middleware/verifyToken.js";
import verifyRoleStd from "../middleware/verifyRoleStd.js";
import { getBookmarks, toggleBookmarks } from "../controllers/bookmark.js";
import enroll from "../controllers/enroll.js";
import { getNews } from "../controllers/NewsManagement.js";
import { getScholarshipStats } from "../controllers/scholarshipStats.js";

const router = express.Router();

router.get("/scholarships", getAllScholarship);

router.get("/bookmarks", verifyRoleStd, getBookmarks);
router.post("/scholarships/:id/bookmark", verifyRoleStd, toggleBookmarks);

router.post("/scholarships/:id/enroll", verifyRoleStd, enroll);


router.post(
  "/scholarships/:id/request-info",
  verifyToken,
  verifyRoleStd,
  requestScholarshipInfo
);

// ข่าว
router.get("/news", getNews);

//router.get("/scholarships/:id/stats", verifyToken, getScholarshipStats);

export default router;
