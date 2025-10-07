# 🚀 Smart Farm Dashboard - คู่มือการใช้งานฉบับย่อ

## 📥 วิธีการติดตั้งแบบเร็ว (Copy & Paste)

### สำหรับผู้ใช้ Windows (แนะนำ)
```cmd
# 1. Clone repository
git clone https://github.com/thaitechzone/DashboardDemoBasic.git

# 2. เข้าไปในโฟลเดอร์
cd DashboardDemoBasic

# 3. รันระบบ (วิธีง่ายที่สุด)
run-dashboard.bat
```

### สำหรับผู้ใช้ PowerShell
```powershell
# รันคำสั่งเดียวจบ
git clone https://github.com/thaitechzone/DashboardDemoBasic.git; cd DashboardDemoBasic; .\run-dashboard.ps1
```

### สำหรับผู้ใช้ Linux/macOS
```bash
# รันคำสั่งเดียวจบ  
git clone https://github.com/thaitechzone/DashboardDemoBasic.git && cd DashboardDemoBasic && chmod +x run-dashboard.sh && ./run-dashboard.sh
```

---

## 🌐 การเข้าถึงระบบ

| บริการ | URL | รายละเอียด |
|--------|-----|------------|
| **Dashboard** | `http://localhost:3001` หรือ `http://localhost:3002` | หน้าจอหลักแสดงข้อมูลเซ็นเซอร์ |
| **API Server** | `http://localhost:5000` | Backend API |
| **Health Check** | `http://localhost:5000/api/health` | ตรวจสอบสถานะระบบ |

---

## ⚡ คำสั่งด่วน

### เริ่มระบบแบบแยกกัน (สำหรับ Developer)
```bash
# Terminal 1: Backend
cd server && node server.js

# Terminal 2: Frontend  
npm run dev
```

### เริ่มระบบแบบพร้อมกัน
```bash
npm run dev:all
```

### ติดตั้ง Dependencies เพิ่มเติม
```bash
npm run setup
```

---

## 🛠️ ไฟล์ที่สำคัญ

- `run-dashboard.bat` - สำหรับ Windows CMD
- `run-dashboard.ps1` - สำหรับ PowerShell  
- `run-dashboard.sh` - สำหรับ Linux/macOS
- `postman-collection/` - ไฟล์ทดสอบ API
- `README-SETUP.md` - คู่มือละเอียด

---

## 🎯 Features หลัก

✅ **Real-time Sensor Data** - อุณหภูมิ ความชื้น  
✅ **Weather Forecast** - พยากรณ์อากาศ 3 วัน (นครศรีธรรมราช)  
✅ **Air Quality PM2.5** - ข้อมูลคุณภาพอากาศ  
✅ **LED Control** - ควบคุมไฟ On/Off  
✅ **Agriculture Theme** - สีเขียวพาสเทลสำหรับงานเกษตร  
✅ **Thai Font (Prompt)** - อ่านง่าย สวยงาม  
✅ **Responsive Design** - รองรับมือถือ แท็บเล็ต  
✅ **API Testing Ready** - Postman Collection พร้อมใช้  

---

## 🔧 การแก้ไขปัญหา

### ปัญหา Port ถูกใช้งาน
```cmd
# หา process ที่ใช้ port
netstat -ano | findstr :5000

# ปิด process  
taskkill /PID <PID> /F
```

### ปัญหา npm install
```bash
# ลบและติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 ใช้งานจริง

1. **เปิด Dashboard:** http://localhost:3001
2. **ดูข้อมูล Real-time:** เซ็นเซอร์อัปเดตทุก 2 วินาที  
3. **ควบคุม LED:** คลิกปุ่ม Switch เพื่อเปิด/ปิดไฟ
4. **ดูพยากรณ์อากาศ:** ส่วนล่างของ Dashboard
5. **ตรวจสอบ PM2.5:** คุณภาพอากาศประจำวัน

---

*🌱 Ready to use สำหรับ Smart Farming Project!*
