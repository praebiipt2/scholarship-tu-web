import jwt from "jsonwebtoken";
import pool from "../pool.js";

const verifyRoleStd  = async (req, res, next) =>{
    const authHeader = req.headers['authorization']
    /* ดึง jwt ออกจาก http req header ที่ชื่อว่า authorization  */
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.sendStatus(401)
    }
    
    try{
        const jwtVerify = jwt.verify(token, process.env.JWT_SECRET)

        const [rows] = await pool.execute("SELECT role FROM users WHERE user_id = ?", [jwtVerify.user_id])

        if (rows.length === 0 || rows[0].role !== "student") {
            return res.status(403).json({ message: "Access denied. Only students allowed" })
        }

        req.user = jwtVerify
        next()

    }catch(err){

        return res.status(403).json({ message: "Token invalid or expired" });
    }

}

export default verifyRoleStd;