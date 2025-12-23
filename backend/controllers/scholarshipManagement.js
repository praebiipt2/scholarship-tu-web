// backend/controllers/scholarshipManagement.js
import pool from "../pool.js";
import cron from "node-cron"; // กำหนดเวลาที่จะรันอัตโนมัติ
import { upload } from "../uploadFile.js";

let connection;

/* ------------------------------------------------------------------
 * 1) CRON อัปเดตสถานะทุนอัตโนมัติ ทุกเที่ยงคืน
 * -----------------------------------------------------------------*/
cron.schedule("0 0 * * *", async () => {
  try {
    connection = await pool.getConnection();

    // แปลงเป็น 'YYYY-MM-DD'
    const today = new Date().toISOString().split("T")[0];

    // เปิดทุน: start_date <= วันนี้ และ end_date >= วันนี้
    await connection.query(
      `UPDATE scholarship_info 
       SET is_active = 1 
       WHERE start_date <= ? AND end_date >= ?`,
      [today, today]
    );

    // ปิดทุน: end_date < วันนี้ หรือ start_date > วันนี้ (เฉพาะทุนที่เปิดอยู่)
    await connection.query(
      `UPDATE scholarship_info 
       SET is_active = 0 
       WHERE (end_date < ? OR start_date > ?) 
         AND is_active = 1`,
      [today, today]
    );

    console.log("Scholarships status updated");
  } catch (err) {
    console.error("cron update scholarships error:", err);
  } finally {
    if (connection) connection.release();
  }
});

function normalizeDate(date) {
  if (!date) return null;
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch (e) {
    return null;
  }
}

/* ------------------------------------------------------------------
 * 2) get ข้อมูลทุนทั้งหมด
 * -----------------------------------------------------------------*/
export const getScholarship = async (req, res) => {
  try {
    const [row] = await pool.execute(
      `SELECT 
          s.scholarship_id,
          s.scho_name,
          s.scho_year,
          s.scho_type,
          s.scho_source,
          s.start_date,
          s.end_date,
          s.scho_desp,
          s.is_active,
          q.qua_id,
          q.std_year,
          q.std_gpa,
          q.std_income
        FROM scholarship_info s
        JOIN qualification q 
          ON s.qualification = q.qua_id`
    );
    res.json(row);
  } catch (err) {
    console.error("getScholarship error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ------------------------------------------------------------------
 * 3) เพิ่มทุน + สร้างแจ้งเตือนให้ นศ. ทุกคน (เว็บ)
 * -----------------------------------------------------------------*/
export const createScholarship = async (req, res) => {
  const {
    schoName,
    schoYear,
    std_year,
    std_gpa,
    std_income,
    type,
    source,
    startDate,
    endDate,
    desp,
    is_active,
  } = req.body;

  const start_date = normalizeDate(startDate);
  const end_date = normalizeDate(endDate);

  const sqlAdd = `INSERT INTO scholarship_info 
    (scho_name, scho_year, qualification, scho_type, scho_source, start_date, end_date, scho_desp, scho_file, image_file, is_active) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

  const quaAdd = `INSERT INTO qualification (std_year, std_gpa, std_income) 
    VALUES (?,?,?)`;

  let pdf = req.files?.file ? req.files.file[0].filename : null;
  let image = req.files?.image ? req.files.image[0].filename : null;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // กัน error เวลา front ส่ง req.files มาครบ/ไม่ครบ
    if (req.files) {
      if (req.files.file) pdf = req.files.file[0].filename;
      if (req.files.image) image = req.files.image[0].filename;
    }

    // 3.1 เพิ่มเงื่อนไขคุณสมบัติ (qualification)
    const [quaResult] = await connection.execute(quaAdd, [
      std_year,
      std_gpa,
      std_income,
    ]);
    const quaId = quaResult.insertId;

    // 3.2 เพิ่มทุน (scholarship_info)
    const [schResult] = await connection.execute(sqlAdd, [
      schoName,
      schoYear,
      quaId,
      type,
      source,
      start_date,
      end_date,
      desp,
      pdf,
      image,
      // ถ้า front ไม่ส่ง is_active มาก็ default เป็น true
      typeof is_active === "boolean" ? is_active : true,
    ]);
    const SchId = schResult.insertId;

    // 3.3 สร้างแจ้งเตือนให้ นศ. ทุกคนที่ active
    // ตอนนี้ใช้ type = 'SCHO_NEW' (ไป map เป็นประโยคสวย ๆ ใน NotiStudent.jsx)
    await connection.execute(
      `INSERT INTO std_notification (student_id, std_noti_type, is_read)
       SELECT s.std_id, 'SCHO_NEW', 0
       FROM student s
       JOIN users u ON s.user_id = u.user_id
       WHERE u.is_active = 1`
    );

    await connection.commit();
    return res.status(201).json({ message: "Created succesfully", SchId });
  } catch (err) {
    console.error("createScholarship error:", err);
    if (connection) await connection.rollback();
    return res
      .status(500)
      .json({ message: "Create is failed , Server error" });
  } finally {
    if (connection) connection.release();
  }
};

/* ------------------------------------------------------------------
 * 4) แก้ไขทุน
 * -----------------------------------------------------------------*/
export const updateScholarship = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const stdYear = updateData.std_year === "" ? 0 : updateData.std_year;
  const stdGpa = updateData.std_gpa === "" ? 0 : updateData.std_gpa;
  const stdIncome = updateData.std_income === "" ? 0 : updateData.std_income;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // โหลดข้อมูลไฟล์เดิม
    const [oldRows] = await connection.execute(
      "SELECT scho_file, image_file FROM scholarship_info WHERE scholarship_id = ?",
      [id]
    );
    const old = oldRows[0];

    let pdf = old?.scho_file || null;
    let image = old?.image_file || null;

    if (req.files?.file) pdf = req.files.file[0].filename;
    if (req.files?.image) image = req.files.image[0].filename;

    // map field จาก body -> column จริงใน DB
    const mappedData = {
      scho_name: updateData.schoName,
      scho_year: updateData.schoYear,
      scho_type: updateData.type,
      scho_source: updateData.source,
      scho_desp: updateData.desp,
      start_date: normalizeDate(updateData.startDate) || null,
      end_date: normalizeDate(updateData.endDate) || null,
      is_active: updateData.is_active,
      scho_file: pdf,
      image_file: image,
    };

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data to update" });
    }

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(mappedData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    const query = `UPDATE scholarship_info 
                   SET ${fields.join(",")} 
                   WHERE scholarship_id = ?`;
    values.push(id);

    const [result] = await connection.execute(query, values);

    // ถ้าแก้ปี/เกรด/รายได้ → อัปเดต qualification ด้วย
    if (
      updateData.std_year !== undefined ||
      updateData.std_gpa !== undefined ||
      updateData.std_income !== undefined
    ) {
      const [oldSch] = await connection.execute(
        "SELECT qualification FROM scholarship_info WHERE scholarship_id = ?",
        [id]
      );

      const quaId = oldSch[0]?.qualification;

      if (quaId) {
        await connection.execute(
          `UPDATE qualification 
           SET std_year = ?, std_gpa = ?, std_income = ? 
           WHERE qua_id = ?`,
          [
            stdYear,
            stdGpa,
            stdIncome,
            quaId,
          ]
        );
      }
    }

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Scholarship not found" });
    }

    await connection.commit();
    return res.status(200).json({ message: "updated successfully" });
  } catch (err) {
    console.error("updateScholarship error:", err);
    if (connection) await connection.rollback();
    return res.status(500).json({ message: "Update failed" });
  } finally {
    if (connection) connection.release();
  }
};

/* ------------------------------------------------------------------
 * 5) ลบทุน
 * -----------------------------------------------------------------*/
export const deleteScholarship = async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) {
    return res.status(400).json({ message: "No IDs provided" });
  }

  try {
    const placeholders = ids.map(() => "?").join(",");
    const sql = `DELETE FROM scholarship_info 
                 WHERE scholarship_id IN (${placeholders})`;
    await pool.query(sql, ids);
    return res.status(204).json({ message: "deleted succesfully" });
  } catch (err) {
    console.error("deleteScholarship error:", err);
    return res
      .status(500)
      .json({ message: "delete is failed ,Server error" });
  }
};

/* ******************************************************************
 * 6) ส่วนใหม่: นศ. กด "สมัครรับข้อมูล" → เช็กคุณสมบัติ →
 *    ถ้าผ่าน ส่งรายละเอียดทุนไป LINE + สร้าง noti ในเว็บ
 * ******************************************************************/

// helper แปลงวันที่ให้สวย ๆ ใน LINE
const formatDateTH = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// สร้างข้อความสำหรับส่งไป LINE
function buildScholarshipLineMessage(sch, qua) {
  let text =
    "รายละเอียดทุนการศึกษา\n\n" +
    `ชื่อทุน: ${sch.scho_name}\n` +
    `ปีการศึกษา: ${sch.scho_year}\n` +
    `ประเภททุน: ${sch.scho_type}\n` +
    `แหล่งที่มา: ${sch.scho_source}\n` +
    `ช่วงเปิดรับ: ${formatDateTH(sch.start_date)} - ${formatDateTH(
      sch.end_date
    )}\n\n` +
    "เงื่อนไขหลัก:\n";

  if (qua.std_year != null) text += `- ชั้นปีที่: ${qua.std_year}\n`;
  if (qua.std_gpa != null) text += `- เกรดเฉลี่ยขั้นต่ำ: ${qua.std_gpa}\n`;
  if (qua.std_income != null)
    text += `- รายได้ไม่เกิน: ${qua.std_income} บาท/ปี\n`;

  text +=
    "\nกรุณาเข้าสู่ระบบเว็บไซต์ทุนการศึกษาเพื่อดูรายละเอียดเพิ่มเติมและดำเนินการสมัครค่ะ";

  return text;
}

// ฟังก์ชันส่งข้อความไป LINE (ตอนนี้ให้ console.log ไว้ก่อน)
// ถ้า Prame มี client ของ LINE อยู่แล้ว ให้เอาโค้ด pushMessage มาใส่ตรงนี้แทน
async function sendLineMessage(lineUserId, text) {
  if (!lineUserId) {
    console.log("ไม่มี line_user_id ไม่ได้ส่ง LINE:", text);
    return;
  }

  console.log("[DEBUG] จะส่ง LINE ถึง", lineUserId, "ข้อความ:\n", text);

  // ตัวอย่าง ถ้าในโปรเจกต์มี client อยู่แล้ว
  // import { client } from "../lineClient.js";
  // await client.pushMessage(lineUserId, { type: "text", text });
}

/**
 * นศ.กด "สมัครรับข้อมูล"
 * POST /api/scholarships/:id/request-info
 */
export const requestScholarshipDetail = async (req, res) => {
  const userId = req.user.user_id || req.user.id; // มาจาก verifyToken
  const { id } = req.params; // scholarship_id

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 6.1 ดึงข้อมูลนักศึกษาจาก user_id
    const [studentRows] = await conn.execute(
      `
      SELECT std_id, std_year, std_gpa, std_income, line_user_id
      FROM student
      WHERE user_id = ?
      `,
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลนักศึกษา" });
    }
    const student = studentRows[0];

    // 6.2 ดึงข้อมูลทุน + เงื่อนไขคุณสมบัติ
    const [schRows] = await conn.execute(
      `
      SELECT
        s.scholarship_id,
        s.scho_name,
        s.scho_year,
        s.scho_type,
        s.scho_source,
        s.start_date,
        s.end_date,
        q.std_year,
        q.std_gpa,
        q.std_income
      FROM scholarship_info s
      JOIN qualification q ON s.qualification = q.qua_id
      WHERE s.scholarship_id = ?
        AND s.is_active = 1
      `,
      [id]
    );

    if (schRows.length === 0) {
      return res.status(404).json({ message: "ไม่พบทุนการศึกษานี้" });
    }
    const sch = schRows[0];
    const qua = {
      std_year: sch.std_year,
      std_gpa: sch.std_gpa,
      std_income: sch.std_income,
    };

    // 6.3 เช็กคุณสมบัติ
    const passYear =
      qua.std_year == null ||
      Number(student.std_year ?? 0) >= Number(qua.std_year ?? 0);

    const passGpa =
      qua.std_gpa == null ||
      Number(student.std_gpa ?? 0) >= Number(qua.std_gpa ?? 0);

    const passIncome =
      qua.std_income == null ||
      Number(student.std_income ?? 0) <= Number(qua.std_income ?? Infinity);

    const isEligible = passYear && passGpa && passIncome;

    // 6.4 ถ้าไม่ผ่านเงื่อนไข → สร้าง noti ว่าไม่ผ่าน แล้วจบ
    if (!isEligible) {
      await conn.execute(
        `
        INSERT INTO std_notification (student_id, std_noti_type, created_at, is_read)
        VALUES (?, ?, NOW(), 0)
        `,
        [student.std_id, "SCHO_NOT_ELIGIBLE"]
      );

      await conn.commit();
      return res.status(200).json({
        eligible: false,
        message: "คุณยังไม่ตรงตามคุณสมบัติของทุนนี้",
      });
    }

    // 6.5 ผ่านเงื่อนไข → ส่งข้อความไป LINE (ถ้ามี line_user_id)
    const text = buildScholarshipLineMessage(sch, qua);
    await sendLineMessage(student.line_user_id, text);

    // 6.6 สร้าง noti ในเว็บ ว่า "ระบบส่งรายละเอียดทุนทาง LINE เรียบร้อยแล้ว"
    await conn.execute(
      `
      INSERT INTO std_notification (student_id, std_noti_type, created_at, is_read)
      VALUES (?, ?, NOW(), 0)
      `,
      [student.std_id, "SCHO_LINE_DETAIL"]
    );

    await conn.commit();

    return res.status(200).json({
      eligible: true,
      message: "ระบบส่งรายละเอียดทุนไปที่ LINE ของคุณแล้ว",
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("requestScholarshipDetail error:", err);
    return res
      .status(500)
      .json({ message: "ไม่สามารถส่งรายละเอียดทุนได้ (server error)" });
  } finally {
    if (conn) conn.release();
  }
};
