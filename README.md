วิธีใช้งาน
1.ติดตั้ง docker
2.git clone code
3.ไปที่โฟลเดอร์ที่เก็บ code แล้ว docker compose up --build เพื่อสร้าง image
4.docker compose up -d เพื่อให้สร้าง container และรัน
5.docker compose restart backend ต่อเพื่อให้ backend restart หลังจาก database ทำงานแล้ว ไม่งั้น backend จะดึงข้อมูลจาก database ไม่ได้
