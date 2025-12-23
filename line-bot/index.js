require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");
const createPoolWithRetry = require("./db"); // db.js

const app = express();
const PORT = Number(process.env.PORT || 3100);
const BYPASS = String(process.env.BYPASS_LINE_MW || "").toLowerCase() === "true";

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

console.log(
  "ENV check:",
  "secretLen=",
  (config.channelSecret || "").length,
  "tokenLen=",
  (config.channelAccessToken || "").length
);

const client = new line.Client(config);

let db;

// -----------------------------
// ฟังก์ชันหลัก : ติดต่อเจ้าหน้าที่
// -----------------------------
async function handleStudentContactMessage(event) {
  const lineUserId = event.source.userId;
  const text = (event.message.text || "").trim();

  console.log("handleStudentContactMessage from", lineUserId, "text =", text);

  let profile = null;
  let lineDisplayName = null;
  let student = null;
  let studentId = null;

  try {
    // ดึงโปรไฟล์จาก LINE
    try {
      profile = await client.getProfile(lineUserId);
      lineDisplayName = profile?.displayName ?? null;
      console.log("  • LINE displayName =", lineDisplayName);
    } catch (err) {
      console.error("  getProfile error:", err.message);
    }

    // หา student จาก DB
    try {
      const [rows] = await db.query(
        `SELECT std_id, std_name, std_lastname 
         FROM student 
         WHERE line_user_id = ?`,
        [lineUserId]
      );
      if (rows.length > 0) {
        student = rows[0];
        studentId = student.std_id;
        console.log("  • found student:", student);
      } else {
        console.log("  • no student bound to this LINE user");
      }
    } catch (err) {
      console.error("  find student error:", err);
    }

    // -----------------------------
    // สร้างข้อความที่จะส่งให้ admin
    // -----------------------------
    const adminTitle = "ข้อความจาก LINE นักศึกษา";

    const adminBody = [
      student
        ? `ชื่อนักศึกษา: ${student.std_name} ${student.std_lastname}`
        : `ยังไม่ได้ผูกกับข้อมูลนักศึกษาในระบบ`,
      student ? `รหัสนักศึกษา: ${student.std_id}` : "",
      `ชื่อ LINE: ${lineDisplayName ?? "-"}`,
      `ข้อความที่ส่งมา: ${text}`,
    ]
      .filter(Boolean)
      .join("\n");

    // บันทึกข้อความนักศึกษาให้ admin
    try {
      await db.query(
        `INSERT INTO admin_message
          (admin_id, student_id, mes_title, mes_desp, mes_status, created_at)
         VALUES (?, ?, ?, ?, 'N', NOW())`,
        [1, studentId, adminTitle, adminBody]
      );
      console.log("  • insert admin_message success");
    } catch (err) {
      console.error("  insert admin_message error:", err);
    }

    // แจ้งเตือน admin
    try {
      await db.query(
        `INSERT INTO admin_notification
          (admin_id, noti_type, student_id, scholarship_id, is_read, created_at)
         VALUES (?, 'line_contact', ?, NULL, 0, NOW())`,
        [1, studentId]
      );
      console.log("  • insert admin_notification success");
    } catch (err) {
      console.error("  insert admin_notification error:", err);
    }
  } catch (err) {
    console.error("handleStudentContactMessage outer error:", err);
  }

  // ตอบกลับนักศึกษา
  const replyText = student
    ? `ระบบได้รับข้อความของนักศึกษาแล้ว 
ชื่อในระบบ: ${student.std_name} ${student.std_lastname} (${student.std_id})
โปรดรอเจ้าหน้าที่ตอบกลับ`
    : `ระบบได้รับข้อความของนักศึกษาแล้ว
ถ้ายังไม่ได้ลงทะเบียน กรุณาใช้คำสั่ง "ลงทะเบียน รหัสนักศึกษา" ก่อนค่ะ`;

  try {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: replyText,
    });
    console.log("  • replied to student done");
  } catch (err) {
    console.error("  reply error:", err);
  }
}

// -----------------------------
// ROUTES
// -----------------------------
app.get("/health", (_req, res) => res.send("ok"));

app.use("/webhook", (req, _res, next) => {
  console.log(
    `[REQ] ${req.method} ${req.url} hasSig=${!!req.headers["x-line-signature"]}`
  );
  next();
});

// -----------------------------
// BYPASS MODE
// -----------------------------
if (BYPASS) {
  app.post("/webhook", (req, res) => {
    console.log("🟢 BYPASS mode: return 200");
    res.sendStatus(200);
  });
} else {
  // -----------------------------
  // WEBHOOK (ปกติ)
  // -----------------------------
  app.post("/webhook", line.middleware(config), async (req, res) => {
    res.sendStatus(200);

    const events = req.body?.events || [];
    for (const e of events) {
      if (e.type !== "message" || e.message.type !== "text") continue;

      const rawText = e.message.text || "";
      const normalized = rawText.replace(/\s+/g, " ").trim();
      const lineUserId = e.source.userId;

      console.log(" incoming text:", JSON.stringify(normalized));

      try {

        // 1) ลงทะเบียน
 
        const reg = /^ลงทะเบียน\s*([0-9]{8,10})$/;
        const match = normalized.match(reg);

        if (match) {
          const stdId = match[1];
          console.log("register command:", stdId);

          let lineDisplayName = null;
          try {
            const profile = await client.getProfile(lineUserId);
            lineDisplayName = profile?.displayName || null;
          } catch (err) {
            console.warn("getProfile error:", err.message);
          }

          const [result] = await db.query(
            `UPDATE student
             SET line_user_id = ?, line_display_name = ?
             WHERE std_id = ?`,
            [lineUserId, lineDisplayName, stdId]
          );

          const replyText =
            result.affectedRows > 0
              ? `ลงทะเบียนสำเร็จแล้วสำหรับรหัส ${stdId}\nระบบจะส่งแจ้งเตือนทุนมาที่ LINE บัญชีนี้ค่ะ`
              : `ไม่พบรหัสนักศึกษา ${stdId} ในระบบค่ะ`;

          await client.replyMessage(e.replyToken, {
            type: "text",
            text: replyText,
          });

          continue;
        }
        // 2) ทุนทั้งหมด
        
        if (normalized === "ทุนทั้งหมด") {
          const [rows] = await db.query(
            `SELECT scho_name 
             FROM scholarship_info 
             WHERE is_active = 1`
          );

          const msg =
            rows.length > 0
              ? "รายชื่อทุนทั้งหมด:\n" +
                rows.map((r) => `• ${r.scho_name}`).join("\n")
              : "ยังไม่มีทุนที่เปิดรับในตอนนี้ค่ะ";

          await client.replyMessage(e.replyToken, {
            type: "text",
            text: msg,
          });
          continue;
        }

        // 3) ติดต่อเจ้าหน้าที่
      
        await handleStudentContactMessage(e);
      } catch (err) {
        console.error("handle error:", err);
        try {
          await client.replyMessage(e.replyToken, {
            type: "text",
            text: "ขออภัย ระบบขัดข้องชั่วคราวค่ะ",
          });
        } catch {}
      }
    }
  });
}

// -----------------------------
// LINE middleware error
// -----------------------------
app.use((err, req, res, next) => {
  console.error(" LINE middleware error:", err.name, "-", err.message);
  res.status(400).send("LINE middleware error: " + err.message);
});

// -----------------------------
// START SERVER
// -----------------------------
async function startServer() {
  db = await createPoolWithRetry();
  app.listen(PORT, "0.0.0.0", () => {
    console.log("server :" + PORT + " ready");
  });
}

startServer();
