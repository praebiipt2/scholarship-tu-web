import pool from "../pool.js";

let connection = await pool.getConnection();

const enroll = async (req, res) => {
  const userId = req.user.user_id;
  const scholarshipId = req.params.id;

  try {
    /* ข้อมูลนักศึกษา */
    const [studentRows] = await pool.execute(
      "SELECT std_id, std_year, std_gpa, std_income FROM student WHERE user_id = ?",
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(403).json({ message: "นักศึกษาเท่านั้นที่สมัครได้" });
    }

    const student = studentRows[0];
    const studentId = student.std_id;

    /* ข้อมูลทุน + เงื่อนไขคุณสมบัติ */
    const [schoRows] = await connection.execute(
      `SELECT s.scholarship_id, s.qualification, 
              q.std_year AS req_year, q.std_gpa AS req_gpa, q.std_income AS req_income
       FROM scholarship_info s
       JOIN qualification q ON s.qualification = q.qua_id
       WHERE scholarship_id = ?`,
      [scholarshipId]
    );

    if (!schoRows.length) {
      return res.status(404).json({ message: "scholarship not found" });
    }

    /* เช็คคุณสมบัติ */
    const qualify = schoRows[0];

    /* ปี */
    const reqYear = qualify.req_year;

    /* รับเฉพาะปี ที่ให้น้อยกว่า 0 เพราะเรากำหนดให้รับเฉพาะเป็นเลขติดลบ */
    if (reqYear < 0) {
      const exact = Math.abs(reqYear);

      if (student.std_year !== exact) {
        return res.status(400).json({
          message: `รับเฉพาะนักศึกษาชั้นปี ${exact} เท่านั้น`,
        });
      }
    } else {
      if (student.std_year < reqYear) {
        return res.status(400).json({
          message: `ชั้นปีไม่ถึงเกณฑ์ (ต้องเป็นปี ${reqYear} ขึ้นไป)`,
        });
      }
    }

    /* เกรด */
    if (student.std_gpa < qualify.req_gpa) {
      return res.status(400).json({ message: "GPA ไม่ถึงเกณฑ์" });
    }

    /* รายได้ */
    const income = student.std_income;
    const reqIncome = qualify.req_income;

    /* ถ้า reqIncome > 0  */
    if (reqIncome > 0 && income > reqIncome) {
      return res.status(400).json({ message: "รายได้มากกว่าเกณฑ์ที่กำหนด" });
    }

    /* เช็คว่าสมัครไปแล้วหรือยัง */
    const [exists] = await connection.execute(
      "SELECT * FROM enroll WHERE std_id = ? AND scho_id = ?",
      [studentId, scholarshipId]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "คุณสมัครทุนนี้ไปแล้ว" });
    }

    /* บันทึกลง db */
    await connection.execute(
      `INSERT INTO enroll (std_id, scho_id, qua_id, enroll_status)
       VALUES (?, ?, ?, ?)`,
      [studentId, scholarshipId, qualify.qualification, 1]
    );

    await connection.commit();

    return res.json({ message: "Enroll Successful" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export default enroll;
