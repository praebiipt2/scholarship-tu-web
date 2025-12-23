import pool from '../pool.js'
import bcrypt from "bcryptjs";

const register = async (req, res) => {
    const { firstName, lastName, StdId, year, gpa, income, email, password, scholarship_interest } = req.body;


    /* กรอกข้อมูลหรือยัง */
    if (!firstName || !lastName || !StdId || !email || !password) {
        return res.status(400).json({ message: "data are required" });
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const sqlUser = `INSERT INTO users (role, email, password, decryption, is_active) VALUES (?, ?, ?, ?, ?)`;
    const sqlStd = `INSERT INTO student (std_id,user_id,std_name,std_lastName,std_year,std_gpa,std_income,scholarship_interest) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

    let connection;
    const role = "student";

    try {

        /* รวมหลายคำสั่งให้เป็นชุดเดียวกัน แต่เรียก pool ตรงๆไม่ได้ */
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [userResults] = await connection.execute(sqlUser, [role, email, hashedPassword, '', true])

        const userId = userResults.insertId;

        /* await connection.execute(sqlSession, [userId, token, true, hashedPassword]) */

        if (role === 'student') {
            await connection.execute(sqlStd, [
                StdId,
                userId,
                firstName,
                lastName,
                year,
                gpa,
                income,
                scholarship_interest
            ])
        }

        /* commit  */
        await connection.commit();
        res.status(201).json({ message: 'registered succesfully', userId })


    } catch (err) {
        /* ย้อนกลับ = ไม่บันทึกข้อมูลทั้งหมด */
        await connection.rollback()
        /* 409 user ซ้ำ */
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Users already exists' })
        } else {
            console.log(err)
            /* 500 server พัง */
            return res.status(500).json({ message: 'Server error' })
        }

        console.log(err)
    } finally {
        connection.release();
    }

}
export default register;