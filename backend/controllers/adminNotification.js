// backend/controllers/adminNotification.js
import pool from "../pool.js";

// ตอนนี้ fix admin_id = 1 ไปก่อน
const DEFAULT_ADMIN_ID = 1;

// 1) ดึง list การแจ้งเตือนของเจ้าหน้าที่
export const getAdminNotifications = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        n.adm_noti_id,
        n.noti_type,
        n.student_id,
        n.scholarship_id,
        n.is_read,
        n.created_at,
        s.std_id,
        s.std_name,
        s.std_lastname,
        s.line_display_name
      FROM admin_notification n
      LEFT JOIN student s ON s.std_id = n.student_id
      WHERE n.admin_id = ?
      ORDER BY n.created_at DESC
      `,
      [DEFAULT_ADMIN_ID]
    );

    return res.json({ notifications: rows });
  } catch (err) {
    console.error("getAdminNotifications error:", err);
    return res
      .status(500)
      .json({ message: "Error loading admin notifications" });
  }
};

// 2) จำนวนที่ยังไม่อ่าน
export const getAdminUnreadCount = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT adm_noti_id, is_read
      FROM admin_notification
      WHERE admin_id = ?
      `,
      [DEFAULT_ADMIN_ID]
    );

    const unreadCount = rows.filter((r) => !r.is_read).length;

    return res.json({ count: unreadCount });
  } catch (err) {
    console.error("getAdminUnreadCount error:", err);
    return res.status(500).json({ count: 0 });
  }
  
};

// 3) mark ทั้งหมดว่าอ่านแล้ว
export const markAllAdminRead = async (req, res) => {
  try {
    const [result] = await pool.execute(
      `
      UPDATE admin_notification
      SET is_read = 1
      WHERE admin_id = ?
        AND (is_read = 0 OR is_read IS NULL)
      `,
      [DEFAULT_ADMIN_ID]
    );

    return res.json({ updated: result.affectedRows });
  } catch (err) {
    console.error("markAllAdminRead error:", err);
    return res
      .status(500)
      .json({ message: "Error marking admin notifications as read" });
  }
};

// 4) mark 1 อันว่าอ่านแล้ว
export const markOneAdminRead = async (req, res) => {
  try {
    const notiId = req.params.id;

    const [result] = await pool.execute(
      `
      UPDATE admin_notification
      SET is_read = 1
      WHERE adm_noti_id = ?
        AND admin_id = ?
      `,
      [notiId, DEFAULT_ADMIN_ID]
    );

    return res.json({ updated: result.affectedRows });
  } catch (err) {
    console.error("markOneAdminRead error:", err);
    return res
      .status(500)
      .json({ message: "Error marking admin notification as read" });
  }
};

// 5) ลบแจ้งเตือน 1 อัน
export const deleteAdminNotification = async (req, res) => {
  try {
    const notiId = req.params.id;

    const [result] = await pool.execute(
      `
      DELETE FROM admin_notification
      WHERE adm_noti_id = ?
        AND admin_id = ?
      `,
      [notiId, DEFAULT_ADMIN_ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบการแจ้งเตือนนี้" });
    }

    return res.json({ message: "ลบการแจ้งเตือนเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("deleteAdminNotification error:", err);
    return res
      .status(500)
      .json({ message: "ไม่สามารถลบการแจ้งเตือนได้" });
  }
};
