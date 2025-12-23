วิธีใช้งาน
ติดตั้ง docker
git clone code
ไปที่โฟลเดอร์ที่เก็บ code แล้ว docker compose up --build เพื่อสร้าง image
docker compose up -d เพื่อให้สร้าง container และรัน
docker compose restart backend ต่อเพื่อให้ backend restart หลังจาก database ทำงานแล้ว ไม่งั้น backend จะดึงข้อมูลจาก database ไม่ได้
