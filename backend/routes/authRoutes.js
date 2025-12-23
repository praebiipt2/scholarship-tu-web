import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import register from '../controllers/register.js'
import login from '../controllers/login.js'
import logout from "../controllers/logout.js";
import navbar from "../controllers/navbar.js "
const router = express.Router();

/* router.get("/login", (req, res) => {
   res.json({ status: 'ok' })
}); */

//router.get('/user/profile',verifyToken,profile)

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

router.get('/navbar',verifyToken, navbar)

export default router;