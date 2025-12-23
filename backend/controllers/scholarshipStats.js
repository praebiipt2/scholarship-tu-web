import pool from "../pool.js";
import jwt from "jsonwebtoken"

let connection = await pool.getConnection();

export const getScholarshipStats = async (req, res) => {
    const { id } = req.params;
    let userId = null;

    /* ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง ที่ไม่ได้ใช้ verifyToken เพราะให้คนทั่วไปดูได้*/
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const jwtVerify = jwt.verify(token, process.env.JWT_SECRET);
            userId = jwtVerify.user_id; // เก็บ user_id ไว้ใช้เช็คคุณสมบัติกรณีเป็นนศ
        } catch (err) {
            // ไม่ต้อง return error 
            userId = null;
        }
    }

    try {
        // สถิติโดยรวมของทุนนี้
        const [[stats]] = await connection.execute(
            `SELECT 
            SUM(CASE WHEN enroll_status = 1 THEN 1 ELSE 0 END) AS approved,
            SUM(CASE WHEN enroll_status = 0 THEN 1 ELSE 0 END) AS rejected,
            COUNT(*) AS total
        FROM enroll
        WHERE scho_id = ?`,
            [id]
        );

        const percent =
            stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(2) : 0;

        let qualify = null;

        /* ถ้าล็อกอินและเป็น student ให้ เช็คคุณสมบัติ */
        if (userId) {
            const [[student]] = await connection.execute(
                "SELECT std_year, std_gpa, std_income FROM student WHERE user_id = ?",
                [userId]
            );

            const [[req]] = await connection.execute(
                `SELECT q.std_year, q.std_gpa, q.std_income, s.scho_desp
                FROM scholarship_info s
                JOIN qualification q ON s.qualification = q.qua_id
                WHERE s.scholarship_id = ?`,
                [id]
            );


            if (student && req) {
                qualify = {
                    year_ok: student.std_year >= req.std_year,
                    gpa_ok: student.std_gpa >= req.std_gpa,
                    income_ok:
                        req.std_income === 0 // =ไม่จำกัดรายได้
                            ? true
                            : student.std_income <= req.std_income,
                };
            }

        }

        /* คำอธิบาย */
        const [[despRow]] = await connection.execute(
            "SELECT scho_desp FROM scholarship_info WHERE scholarship_id = ?",
            [id]
        );

        return res.json({
            approved: stats.approved || 0,
            rejected: stats.rejected || 0,
            total: stats.total || 0,
            percent,
            qualify, // ถ้าไม่ล็อกอิน เป็น null
            desp: despRow?.scho_desp || ""
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });

    } finally {
        connection.release()
    }
}