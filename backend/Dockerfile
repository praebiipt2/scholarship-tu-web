# backend/Dockerfile

FROM node:22

WORKDIR /app

# ติดตั้ง dependency
COPY package*.json ./
RUN npm install
#RUN npm install -g nodemon

# ก็อปโค้ดทั้งหมดเข้า container
COPY . .

EXPOSE 5000

# ไม่ใช้ wait-for-it.sh แล้ว รัน backend ตรง ๆ เลย
CMD ["npm", "run", "dev"]
