// backend/lineClient.js
import dotenv from "dotenv";
import { Client, middleware } from "@line/bot-sdk";

// โหลด .env / .env.docker (กรณีรันใน docker)
dotenv.config({
  path: process.env.NODE_ENV === "docker" ? ".env.docker" : ".env",
});

// ดึงค่าจาก env
const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const secret = process.env.LINE_CHANNEL_SECRET;

// log เช็คว่ามีค่ามั้ย
console.log("LINE env check:", {
  hasToken: !!token,
  hasSecret: !!secret,
});

// ----------- สร้าง client / middleware แบบกันเครื่องล้ม -----------

let lineClient;
let lineMiddleware;

// client ใช้แค่ access token ก็พอ
if (token) {
  lineClient = new Client({
    channelAccessToken: token,
    // channelSecret ไม่จำเป็นสำหรับ client
  });
} else {
  console.warn(" ยังไม่ได้ตั้งค่า LINE_CHANNEL_ACCESS_TOKEN จะยังส่ง LINE ไม่ได้");
  lineClient = null;
}

// middleware ต้องใช้ secret ถ้าไม่มีจะทำ middleware เปล่า ๆ ที่แค่ next()
if (token && secret) {
  const cfg = { channelAccessToken: token, channelSecret: secret };
  lineMiddleware = middleware(cfg);
} else {
  console.warn(
    " LINE middleware ปิดการตรวจลายเซ็นชั่วคราว (LINE_CHANNEL_SECRET ไม่มีค่า)"
  );
  lineMiddleware = (req, res, next) => next();
}

export { lineClient, lineMiddleware };
