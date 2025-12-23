import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getBookmarks, toggleBookmarks} from "../controllers/bookmark.js";
import { getStudentProfile, updateStudent, toggleEnrollStatus } from "../controllers/profile.js"
import { getStdDashboard } from "../controllers/studentDashboard.js"


const router = express.Router();

router.get('/bookmark',verifyToken,getBookmarks)
router.post('/bookmark',verifyToken,toggleBookmarks)

router.get("/profile", verifyToken, getStudentProfile);
router.put("/profile", verifyToken, updateStudent);
router.put("/enroll/toggle/:id", verifyToken, toggleEnrollStatus);

router.get("/dashboard",verifyToken,getStdDashboard)


export default router;