import pool from "../pool.js";

let connection = await pool.getConnection();

/* get */
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.user_id; // จาก token

    // ดึง student_id
    const [studentRows] = await connection.execute(
      "SELECT std_id FROM student WHERE user_id = ?",
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" })
    }

    const student_id = studentRows[0].std_id

    /* เรียก scholarships ที่ bookmarks(ตาราง)  */
    const [rows] = await connection.execute(
      `SELECT b.scho_id, s.* 
        FROM bookmark b
        JOIN scholarship_info s ON b.scho_id = s.scholarship_id
        WHERE b.student_id = ? AND b.is_active = 1`,
      [student_id]
    );

    return res.json(rows)

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Server error" })
  } finally {
    if (connection) connection.release();
  }
};

/* add or delete */
export const toggleBookmarks = async (req, res) => {
  try {

    const userId = req.user.user_id// จาก token
    const { id: scho_id } = req.params;

    /* ดึง student_id จาก user_id ก่อน */
    const [studentRows] = await connection.execute(
      "SELECT std_id  FROM student WHERE user_id = ?",
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student_id = studentRows[0].std_id;

    /* ถ้า bookmark อยู่แล้ว เมื่อกดอีกครั้งจะทำการยกเลิก bookmaek */
    const [exists] = await connection.execute('SELECT * FROM bookmark WHERE student_id = ? AND scho_id = ?', [student_id, scho_id])
    //ใช้ length กับ SELECT จะได้ค่า arr ของ obj 
    if (exists.length > 0) {
      /*      const newStatus = rows[0].is_active === 1 ? 0 : 1; */
      //มีอยู่แล้วให้ลบ
      await connection.execute('DELETE FROM bookmark WHERE student_id = ? AND scho_id = ?', [/* newStatus, */ student_id, scho_id])
      /*             res.status(201).json({ message: 'bookmark status updated', is_active: newStatus }) */
      return res.status(201).json({ message: 'Bookmark removed', active: false })
    } else {
      //ไม่มีให้เพิ่ม ใส่ return เพราะเมื่อส่ง res จะหยุด execution (ส่ง res เยอะเลยต้อง return)
      await connection.execute('INSERT INTO bookmark (student_id, scho_id, is_active) VALUE(?,?,?)', ([student_id, scho_id, true]))
      return res.status(201).json({ message: 'Bookmark added', active: true });
    }
    
  } catch (err) {
    console.log('add bk err ', err)
    return res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
}