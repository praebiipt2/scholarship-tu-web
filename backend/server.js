import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import stdRoutes from "./routes/stdRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

import notificationRoutes from "./routes/notification.js";
import adminNotificationRoutes from "./routes/adminNotification.js";

import { lineMiddleware } from "./lineClient.js";
import { handleLineWebhook } from "./controllers/lineWebhook.js";

import pool from "./pool.js"; // ✅ ถูกต้อง

dotenv.config();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.1.100:5173",
];

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/line/webhook", lineMiddleware, handleLineWebhook);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* routes */
app.use("/", authRoutes);
app.use("/user", stdRoutes);
app.use("/admin", adminRoutes);
app.use("/api", publicRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);

// ✅ ผูก pool ให้ routes ใช้
app.locals.db = pool;

// ✅ start server ได้เลย
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
