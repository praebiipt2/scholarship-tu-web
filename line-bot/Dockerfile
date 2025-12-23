# ใช้ Node.js เวอร์ชัน 18 (หรือ 20 ก็ได้)
FROM node:18

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เข้าไปก่อน (เพื่อแยกขั้นตอน install)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกทุกไฟล์ที่เหลือเข้าไปใน container
COPY . .

# กำหนดพอร์ตที่ container จะเปิด
EXPOSE 3000

CMD ["npm", "start"]
