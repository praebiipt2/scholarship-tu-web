// backend/middleware/verifyRoleAdmin.js

export default function verifyRoleAdmin(req, res, next) {
  // ต้องผ่าน verifyToken มาก่อน ถึงจะมี req.user
  if (!req.user) {
    return res.status(401).json({ message: "กรุณาเข้าสู่ระบบก่อน" });
  }

  // ปรับตาม payload ตอน login (ตอนนี้ใช้ role = 'admin' / 'student')
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "สิทธิเข้าถึงเฉพาะเจ้าหน้าที่ / ผู้ดูแลระบบเท่านั้น" });
  }

  next();
}
