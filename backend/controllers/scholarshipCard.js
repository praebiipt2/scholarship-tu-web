import pool from "../pool.js";
import { lineClient } from "../lineClient.js";

// -----------------------------------------------------
// ทุนทั้งหมด
// -----------------------------------------------------
export const getAllScholarship = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        s.scholarship_id,
        s.scho_name,
        s.scho_year,
        s.scho_type,
        s.scho_source,
        s.start_date,
        s.end_date,
        s.scho_desp,
        s.scho_file,
        s.is_active,
        q.qua_id,
        q.std_year,
        q.std_gpa,
        q.std_income
      FROM scholarship_info s
      LEFT JOIN qualification q 
        ON s.qualification = q.qua_id
      WHERE s.is_active = 1
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAllScholarship error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// เมื่อ นศ. กด "สมัครรับข้อมูล"
// -----------------------------------------------------
export const requestScholarshipInfo = async (req, res) => {
  const userId = req.user.user_id || req.user.id;
  const scholarshipId = req.params.id;

  try {
    // 1) นักศึกษา
    const [[student]] = await pool.execute(
      `
      SELECT 
        std_id,
        std_year,
        std_gpa,
        std_income,
        line_user_id
      FROM student
      WHERE user_id = ?
      `,
      [userId]
    );

    // 2) ทุน
    const [[scholar]] = await pool.execute(
      `
      SELECT 
        s.scholarship_id,
        s.scho_name,
        s.scho_year,
        s.scho_type,
        s.scho_source,
        s.scho_desp,
        s.start_date,
        s.end_date,
        q.std_year   AS req_year,
        q.std_gpa    AS req_gpa,
        q.std_income AS req_income
      FROM scholarship_info s
      LEFT JOIN qualification q
        ON s.qualification = q.qua_id
      WHERE s.scholarship_id = ?
      `,
      [scholarshipId]
    );

    if (!student || !scholar) {
      return res.status(404).json({ message: "ไม่พบนักศึกษา/ทุน" });
    }

    const reqYear = scholar.req_year;
    const reqGpa = scholar.req_gpa;
    const reqIncome = Number(scholar.req_income);

    const studentYear = student.std_year;
    const studentGpa = student.std_gpa;
    const studentIncome = student.std_income;

    // ---------- ตรวจคุณสมบัติ ----------
    if (reqYear < 0) {
      const exact = Math.abs(reqYear);
      if (studentYear !== exact) {
        return res.status(400).json({
          message: `รับเฉพาะนักศึกษาชั้นปี ${exact} เท่านั้น`,
        });
      }
    } else if (studentYear < reqYear) {
      return res.status(400).json({
        message: `ชั้นปีไม่ถึงเกณฑ์ (ต้องเป็นปี ${reqYear} ขึ้นไป)`,
      });
    }

    if (studentGpa < reqGpa) {
      return res.status(400).json({ message: "GPA ไม่ถึงเกณฑ์" });
    }

    if (reqIncome > 0 && studentIncome > reqIncome) {
      return res.status(400).json({ message: "รายได้มากกว่าเกณฑ์ที่กำหนด" });
    }

    if (!student.line_user_id) {
      return res.status(400).json({
        message: `ยังไม่ได้เชื่อม LINE กรุณาพิมพ์ "ลงทะเบียน ${student.std_id}" ในแชทบอท`,
      });
    }

    // ---------- สร้างข้อความเงื่อนไข (แก้ bug ตรงนี้) ----------
    const yearText =
      reqYear < 0
        ? `เฉพาะปี ${Math.abs(reqYear)}`
        : `ปี ${reqYear} ขึ้นไป`;

    const gpaText = reqGpa > 0 ? `${reqGpa}` : "ไม่กำหนด";
    const incomeText = reqIncome > 0 ? `${reqIncome.toLocaleString()} บาท` : "ไม่กำหนด";

    const formatDate = (v) =>
      v
        ? new Date(v).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "-";

    const detailText =
      `รายละเอียดทุนการศึกษา\n\n` +
      `ชื่อทุน: ${scholar.scho_name}\n` +
      `ปีการศึกษา: ${scholar.scho_year}\n` +
      `ช่วงเปิดรับ: ${formatDate(scholar.start_date)} - ${formatDate(scholar.end_date)}\n\n` +
      `เงื่อนไขหลัก:\n` +
      `- ชั้นปีที่รับ: ${yearText}\n` +
      `- เกรดเฉลี่ยขั้นต่ำ: ${gpaText}\n` +
      `- รายได้ไม่เกิน: ${incomeText}\n`;

    await lineClient.pushMessage(student.line_user_id, {
      type: "text",
      text: detailText,
    });

    return res.json({
      message: `ระบบได้ส่งรายละเอียดทุน "${scholar.scho_name}" ไปที่ LINE แล้ว`,
    });
  } catch (err) {
    console.error("requestScholarshipInfo error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};
