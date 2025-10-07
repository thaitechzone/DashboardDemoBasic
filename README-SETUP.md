# 🌱 Smart Farm Dashboard - คู่มือการติดตั้งและใช้งาน

## 📋 ข้อมูลโครงการ
**Smart Farm Dashboard** - ระบบตรวจสอบสภาพแวดล้อมเพื่อการเกษตรอัจฉริยะ
- **Frontend:** React + Vite (Port 3001)  
- **Backend:** Node.js + Express (Port 5000)
- **API Testing:** Postman Collection พร้อมใช้งาน
- **Theme:** Agriculture Pastel Colors with Prompt Font

---

## 🚀 ขั้นตอนการติดตั้งใหม่

### 1. Clone Repository
```bash
git clone https://github.com/thaitechzone/DashboardDemoBasic.git
cd DashboardDemoBasic
```

### 2. ติดตั้ง Dependencies
```bash
# ติดตั้ง packages สำหรับ frontend
npm install

# ติดตั้ง packages สำหรับ backend (ถ้าจำเป็น)
cd server
npm install
cd ..
```

### 3. รันระบบ
#### วิธีที่ 1: รันแยกกัน (แนะนำสำหรับ Development)
```bash
# Terminal 1 - รัน Backend API
cd server
node server.js

# Terminal 2 - รัน Frontend  
npm run dev
```

#### วิธีที่ 2: รันพร้อมกัน (ใช้ไฟล์ batch)
```bash
# Windows
run-dashboard.bat

# หรือใช้ PowerShell script
.\run-dashboard.ps1
```

---

## 🛠️ ไฟล์สำหรับรันอัตโนมัติ

### สำหรับ Windows (.bat)
ไฟล์: `run-dashboard.bat`

### สำหรับ PowerShell (.ps1) 
ไฟล์: `run-dashboard.ps1`

---

## 🌐 การเข้าถึงระบบ

### Frontend Dashboard
- **URL:** http://localhost:3001
- **Features:** 
  - Real-time sensor monitoring
  - Weather forecast (Nakhon Si Thammarat)
  - Air Quality PM2.5 data
  - LED control system

### Backend API
- **URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health
- **Endpoints:**
  - `GET /api/sensor-data` - ข้อมูลเซ็นเซอร์
  - `GET/POST /api/led-control` - ควบคุม LED
  - `GET /api/history` - ประวัติข้อมูล

### API Testing
- **Postman Collection:** `postman-collection/ESP32-Dashboard-API.postman_collection.json`
- **Environment:** `postman-collection/ESP32-Dashboard-Local.postman_environment.json`

---

## 📁 โครงสร้างโปรเจค

```
DashboardDemoBasic/
├── src/                    # Frontend React components
│   ├── App.jsx            # Main dashboard component
│   ├── index.css          # Styling with agriculture theme
│   └── main.jsx           # Entry point
├── server/                # Backend API
│   └── server.js          # Express server with mock data
├── postman-collection/    # API testing files
│   ├── ESP32-Dashboard-API.postman_collection.json
│   └── ESP32-Dashboard-Local.postman_environment.json
├── public/                # Static assets
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
├── run-dashboard.bat      # Windows batch script
├── run-dashboard.ps1      # PowerShell script
└── README-SETUP.md        # This setup guide
```

---

## 🔧 การแก้ไขปัญหาทั่วไป

### ปัญหา Port ถูกใช้งาน
```bash
# หา process ที่ใช้ port 5000
netstat -ano | findstr :5000

# ปิด process (แทนที่ PID ด้วยหมายเลขจริง)
taskkill /PID <PID_NUMBER> /F
```

### ปัญหา Dependencies
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
rm package-lock.json
npm install
```

### ปัญหา Hot Reload ไม่ทำงาน
- รีสตาร์ท development server
- ตรวจสอบว่าไฟล์ไม่มีข้อผิดพลาด syntax

---

## 🎨 Features หลัก

- ✅ **Real-time Monitoring** - อัปเดตข้อมูลทุก 2 วินาที
- ✅ **Agriculture Theme** - สีเขียวพาสเทลเหมาะกับงานเกษตร  
- ✅ **Weather Integration** - พยากรณ์อากาศ 3 วัน นครศรีธรรมราช
- ✅ **Air Quality** - ข้อมูล PM2.5 และมลพิษอากาศ
- ✅ **Responsive Design** - รองรับหน้าจอทุกขนาด
- ✅ **Thai Typography** - ใช้ฟอนต์ Prompt สำหรับภาษาไทย
- ✅ **API Testing** - Postman Collection พร้อมใช้งาน

---

## 👨‍💻 การพัฒนาต่อ

### เพิ่ม Sensor ใหม่
1. แก้ไข `server/server.js` - เพิ่ม mock data
2. อัปเดต `src/App.jsx` - เพิ่ม UI component
3. ปรับ `src/index.css` - สไตล์ใหม่

### เชื่อมต่อ ESP32 จริง
1. แก้ไข endpoint ใน `server/server.js`
2. ตั้งค่า CORS สำหรับ ESP32 IP
3. อัปเดต Postman collection

### Deploy Production
1. Build frontend: `npm run build`
2. ตั้งค่า reverse proxy (Nginx)
3. ใช้ PM2 สำหรับ Node.js server

---

## 📞 การติดต่อและสนับสนุน

- **Repository:** https://github.com/thaitechzone/DashboardDemoBasic
- **Issues:** สร้าง GitHub Issue สำหรับปัญหาหรือข้อเสนอแนะ
- **License:** MIT License

---

*อัปเดตล่าสุด: October 7, 2025*