import pool from "../pool.js";

let connection = await pool.getConnection();

export const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        /* get นศคนนั้นๆ อารมณ์แบบ const qualify = schoRows[0]; */
        const [[student]] = await connection.execute(
            `SELECT 
            s.std_id,
            s.std_name,
            s.std_lastname,
            s.std_year,
            s.std_gpa,
            s.std_income,
            u.email,
            u.phone
            FROM student s
            JOIN users u ON s.user_id = u.user_id
            WHERE s.user_id = ?`,
            [userId]
        )

        if (!student) return res.status(404).json({ message: 'Student not found' });

        /* get ทุนที่นศสมัครรับทุน */
        const [enrolledList] = await connection.execute(
            `SELECT 
                e.enroll_id, 
                e.enroll_status, 
                s.scholarship_id, 
                s.scho_name, 
                s.scho_type,
                s.scho_source,
                s.start_date,
                s.end_date,
                s.is_active
            FROM enroll e
            JOIN scholarship_info s ON e.scho_id = s.scholarship_id
            WHERE e.std_id = ?`,
            [student.std_id]
        )

        /* ส่งข่อมูลกลับ */
        return res.json({
            student,
            enrolled: enrolledList
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const updateStudent = async (req, res) => {
    try {
        const userId = req.user.user_id; //get จาก token
        const { std_name, std_lastname, std_year, std_gpa, std_income, email, phone } = req.body

        /* update */
        const sql = `UPDATE student s JOIN users u ON s.user_id = u.user_id
        SET 
            s.std_name = ?,
            s.std_lastname = ?,
            s.std_year = ?,
            s.std_gpa = ?,
            s.std_income = ?,
            u.email = ?,
            u.phone = ?
        WHERE s.user_id = ?`;

        await connection.execute(sql, [
            std_name,
            std_lastname,
            std_year,
            std_gpa,
            std_income,
            email,
            phone,
            userId
        ]);

        await connection.commit();
        return res.json({ message: 'Updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
}

export const toggleEnrollStatus = async (req, res) => {
    try {
        const { id } = req.params; // enroll_id
        /* get  enroll  */
        const [[exist]] = await pool.execute(
            'SELECT enroll_status FROM enroll WHERE enroll_id = ?',
            [id]
        );

        if (!exist) return res.status(404).json({ message: 'Enroll not found' });

        /* สลับสถานะ ถ้าเป"็น 1 => 0 ถ้าเป็น 0 => 1 */
        const newStatus = exist.enroll_status === 1 ? 0 : 1;

        await connection.execute(
            'UPDATE enroll SET enroll_status = ? WHERE enroll_id = ?',
            [newStatus, id]
        );

        await connection.commit();
        return res.json({ message: 'Status updated', enroll_status: newStatus });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
}