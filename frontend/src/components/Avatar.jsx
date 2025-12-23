import React from "react";

const colors = [
  "#EF5350", // red
  "#AB47BC", // purple
  "#5C6BC0", // indigo
  "#29B6F6", // blue
  "#26A69A", // teal
  "#66BB6A", // green
  "#FFCA28", // yellow
  "#FF7043", // orange
];

/* กำหนดให้สีเดียวชื่อเดียวกัน */
function getColorFromName(name) {
  let hash = 0; //เก็บ ASCII 

  /* loop ดึง char แล้วแปลงเป็น ASCII แล้วไปผสมเลขแบบกระจาย  hash * 31 */
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]; //Math.abs = เลขบวก % colors.length  หารเอาเศษด้วยจำนวนสี
}

/* รองรับภาษาไทย */
function getInitial(name) {
  if (!name) return "?";

  const cleaned = name.trim().normalize("NFC"); //NFC พยายามรวม ตัวอักษร + สระรวมกันเป็นโค้ดยูนิตเดี่ยว
 
  //loop unicode code point
  for (const char of cleaned) {
   /*  ถ้าตัวอักษรแรกจะไม่มีสระ จะให้เป็นตัวใหญ่(ไทยไม่เปลี่ยนรูปแบบ) */
    if (!/[\u0E31-\u0E4E]/.test(char)) { 
      return char.toUpperCase();
    }
  }
  return "?"; //ถ้าเจอสระลอย จะข้ามจนกว่าจะเจอตัวอักษร
} 

export default function Avatar({ name = "", size = 120 }) {
  const initial = getInitial(name);
  const bg = getColorFromName(name);

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.45,
      }}
    >
      {initial}
    </div>
  );
}