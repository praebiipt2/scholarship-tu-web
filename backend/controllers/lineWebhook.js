// backend/controllers/lineWebhook.js
import pool from "../pool.js";
import { lineClient } from "../lineClient.js";

export const handleLineWebhook = async (req, res) => {
  try {
    console.log("LINE webhook body:", JSON.stringify(req.body, null, 2));

    const events = req.body?.events ?? [];

    // เคส Verify จาก LINE (ไม่มี events)
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(200).end();
    }

    // จัดการแต่ละ event แยกกัน
    await Promise.all(events.map(processEvent));

    // ต้องตอบ 200 ให้ LINE เสมอ
    return res.status(200).end();
  } catch (err) {
    console.error("handleLineWebhook error:", err);
    // ถ้า error ก็ยังตอบ 200 กลับไป เพื่อไม่ให้ LINE ยิงซ้ำรัว ๆ
    return res.status(200).end();
  }
};

// ฟังก์ชันจัดการ event เดียว
async function processEvent(event) {
  try {
    // เอาเฉพาะข้อความธรรมดา
    if (event.type !== "message" || event.message.type !== "text") return;

    const text = (event.message.text || "").trim();
    const lineUserId = event.source.userId;

    // -------------------------
    // 1) เคสลงทะเบียน "ลงทะเบียน 680741145"
    // -------------------------
    // เคสลงทะเบียน "ลงทะเบียน 680741145"
const regMatch = text.match(/^ลงทะเบียน\s+(\d{6,})$/);
if (regMatch) {
  const stdId = regMatch[1];
  const lineUserId = event.source.userId;

  // ดึงโปรไฟล์ LINE เพื่อเอา displayName มาเก็บ
  let lineDisplayName = null;
  try {
    const profile = await lineClient.getProfile(lineUserId);
    lineDisplayName = profile?.displayName || null;
  } catch (e) {
    console.warn("getProfile error:", e.message);
  }

  // อัปเดตตาราง student ให้เก็บทั้ง userId + displayName
  const [result] = await pool.execute(
    "UPDATE student SET line_user_id = ?, line_display_name = ? WHERE std_id = ?",
    [lineUserId, lineDisplayName, stdId]
  );

  let replyText;
  if (result.affectedRows > 0) {
    replyText =
      `ลงทะเบียนสำเร็จแล้วสำหรับรหัส ${stdId} \n` +
      `ต่อไประบบจะส่งแจ้งเตือนและรายละเอียดทุนมาที่ LINE บัญชีนี้นะคะ`;
  } else {
    replyText = `ไม่พบรหัสนักศึกษา ${stdId} ในระบบค่ะ `;
  }

  await lineClient.replyMessage(event.replyToken, {
    type: "text",
    text: replyText,
  });

  return;
}


    // -------------------------
    // 2) เคสข้อความสอบถามทั่วไปจากนักศึกษา
    // -------------------------

    // หา student จาก line_user_id
    const [[student]] = await pool.execute(
      `
      SELECT std_id, std_name, std_lastname
      FROM student
      WHERE line_user_id = ?
      `,
      [lineUserId]
    );

    if (!student) {
      // ยังไม่เคยลงทะเบียน แต่ส่งข้อความมา
      await lineClient.replyMessage(event.replyToken, {
        type: "text",
        text:
          'กรุณาลงทะเบียนรหัสนักศึกษาก่อน โดยพิมพ์\n' +
          '"ลงทะเบียน รหัสนักศึกษา" เช่น\n' +
          "ลงทะเบียน 680741145",
      });
      return;
    }

    // 2.1 บันทึก noti ให้เจ้าหน้าที่ (ตอนนี้ fix admin_id = 1 ไปก่อน)
    await pool.execute(
      `
      INSERT INTO admin_notification
        (admin_id, noti_type, student_id, scholarship_id, is_read, created_at)
      VALUES
        (1, 'student_message', ?, NULL, 0, NOW())
      `,
      [student.std_id]
    );

    // 2.2 (ถ้ามี table log ข้อความในอนาคต ค่อยเพิ่มได้)
    // await pool.execute(
    //   "INSERT INTO student_message (student_id, message_text, created_at) VALUES (?, ?, NOW())",
    //   [student.std_id, text]
    // );

    // 2.3 ตอบกลับนักศึกษาว่าได้รับข้อความแล้ว
    await lineClient.replyMessage(event.replyToken, {
      type: "text",
      text:
        "ระบบได้รับข้อความของคุณเรียบร้อยแล้วค่ะ " +
        "เจ้าหน้าที่จะตรวจสอบและตอบกลับผ่านระบบในภายหลัง ขอบคุณค่ะ",
    });
  } catch (err) {
    console.error("processEvent error:", err);
  }
}
