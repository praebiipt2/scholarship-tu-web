
import pool from "../pool.js";

export const getStudentNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;

    const [rows] = await pool.execute(
      `
      SELECT
        n.std_noti_id,
        n.std_noti_type,
        n.created_at,
        n.is_read
      FROM std_notification n
      JOIN student s ON s.std_id = n.student_id
      WHERE s.user_id = ?
      ORDER BY n.created_at DESC
      `,
      [userId]
    );

    res.json({ notifications: rows });
  } catch (err) {
    console.error("getStudentNotifications error:", err);
    res.status(500).json({ message: "Error loading notifications" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;

    const [rows] = await pool.execute(
      `
      SELECT COUNT(*) AS count
      FROM std_notification n
      JOIN student s ON s.std_id = n.student_id
      WHERE s.user_id = ?
        AND (n.is_read = 0 OR n.is_read IS NULL)
      `,
      [userId]
    );

    const unreadCount = rows[0]?.count || 0;

    console.log("getUnreadCount:", unreadCount);

    return res.json({ count: unreadCount });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ count: 0 });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;

    const [result] = await pool.execute(
      `
      UPDATE std_notification n
      JOIN student s ON s.std_id = n.student_id
      SET n.is_read = 1
      WHERE s.user_id = ?
        AND (n.is_read = 0 OR n.is_read IS NULL)
      `,
      [userId]
    );

    res.json({ updated: result.affectedRows });
  } catch (err) {
    console.error("markAllRead error:", err);
    res.status(500).json({ message: "Error marking notifications as read" });
  }
};

export const markOneRead = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const notiId = req.params.id;

    const [result] = await pool.execute(
      `
      UPDATE std_notification n
      JOIN student s ON s.std_id = n.student_id
      SET n.is_read = 1
      WHERE n.std_noti_id = ?
        AND s.user_id = ?
      `,
      [notiId, userId]
    );

    res.json({ updated: result.affectedRows });
  } catch (err) {
    console.error("markOneRead error:", err);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

export const deleteStudentNotification = async (req, res) => {
  const notiId = req.params.id;
  const userId = req.user.user_id || req.user.id;

  try {
    const [result] = await pool.execute(
      `
      DELETE n
      FROM std_notification n
      JOIN student s ON n.student_id = s.std_id
      WHERE n.std_noti_id = ?
        AND s.user_id = ?
      `,
      [notiId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบการแจ้งเตือนนี้" });
    }

    return res.json({ message: "ลบการแจ้งเตือนเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("deleteStudentNotification error:", err);
    return res.status(500).json({ message: "ไม่สามารถลบการแจ้งเตือนได้" });
  }
};
