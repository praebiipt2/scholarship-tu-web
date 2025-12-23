import pool from "../pool.js";

export const getStudent = async (req, res) => {
    try {
        const [rows] = await pool.execute(

            `SELECT s.*, u.is_active
            FROM student s
            JOIN users u ON s.user_id = u.user_id`
        )

        res.json({ students: rows })

    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getStudentInfo = async (req, res) => {
    try {
        const { id } = req.params;

        const [student] = await pool.execute(`
            SELECT s.*, u.is_active
            FROM student s
            JOIN users u ON s.user_id = u.user_id
            WHERE s.std_id = ?`, [id]);

       
        const [bookmark] = await pool.execute(`
            SELECT si.*
            FROM bookmark b
            JOIN scholarship_info si ON b.scho_id = si.scholarship_id
            WHERE b.student_id = ?`, [id]);

        
        const [enroll] = await pool.execute(`
            SELECT si.*, e.enroll_status
            FROM enroll e
            JOIN scholarship_info si ON e.scho_id = si.scholarship_id
            WHERE e.std_id = ?`, [id]);


        res.json({
            student: student[0],
            bookmark,
            enroll
        });




    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' })
    }
}