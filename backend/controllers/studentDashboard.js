import pool from "../pool.js";

let connection = await pool.getConnection();

export const getStdDashboard = async (req, res) => {
    try {
        const userId = req.user.user_id; //ดึงข้อมูลจาก token

        /* get id  */
        const [[student]] = await connection.execute(
            `SELECT std_id FROM student WHERE user_id = ?`,
            [userId]
        )

        if (!student) return res.status(404).json({ message: 'Student not found' })

        const stdId = student.std_id;

        /* ทุนที่สมัครรับทุนทั้งหมด */
        const [[{ total }]] = await connection.execute( //เวลาเรียกข้อมูลจะได้ [[{total : x }]] ลัดมาใส่ด้านหน้าแทน จะได้คินค่าเป็นตัวเลขเพียวๆ
            `SELECT COUNT(*) AS total FROM enroll WHERE std_id = ?`,
            [stdId]
        )

        /* get ชื่อทุนที่ได้รับ */
        const [approvedList] = await connection.execute(
            `SELECT s.scho_name 
            FROM enroll e
            JOIN scholarship_info s ON e.scho_id = s.scholarship_id
            WHERE e.std_id = ? AND e.enroll_status = 1`,
            [stdId]
        );

        /* get ชื่อทุนที่ไม้ได้รับ */
        const [rejectedList] = await connection.execute(
            `SELECT s.scho_name 
            FROM enroll e
            JOIN scholarship_info s ON e.scho_id = s.scholarship_id
            WHERE e.std_id = ? AND e.enroll_status = 0`,
            [stdId]
        );

        /* ได้ทุน(int) */
        const [[{ approved }]] = await pool.execute(
            `SELECT COUNT(*) AS approved 
            FROM enroll 
            WHERE std_id = ? AND enroll_status = 1`,
            [stdId]
        )

        const rejected = total - approved //หาจำนวนที่ไม้ได้ทุน
        const percent = total > 0 ? ((approved / total) * 100).toFixed(2) : 0 // toFixed(2) = ทศนิยม 2 ตำแน่ง : 0 = ถ้าเป็น 0 ให่คืนค่า 0 dyo err

        /* ส่งไป frontend */
        return res.json({
            total,
            approved,
            rejected,
            percent, approvedNames: approvedList.map(r => r.scho_name), //ส่งรายชื่อทุนที่ได้
            rejectedNames: rejectedList.map(r => r.scho_name) //ส่งรายชื่อทุนที่ไม่ได้
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    } finally {
        connection.release()
    }
}