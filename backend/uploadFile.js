import multer from "multer";
import path from "path";

/* กำหนดโฟลเดอร์เก็บไฟล์ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  /* ตั้งชื่อไฟล์กันซ้ำ */
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname //รูปแบบชื่อี วัน-ชื่อไฟล์เดิม
    )
  },
})

/* กำหนดประเภทที่ upload ได้ */
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ]

  /* ถ้าประภทตรงกันก็อัปได้  mimetype = ประเภท*/
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("file type incorrect "), false);
  }
}

/* uploader  */
export const upload = multer({ storage, fileFilter })

export const uploadFields = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
])