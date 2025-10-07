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

# Quick Start Guide - ทดสอบ API ด้วย Postman

## ขั้นตอนการเริ่มต้นอย่างรวดเร็ว

### 1. เปิด Postman และ Import Collection
```
1. เปิด Postman
2. คลิก Import -> Upload Files
3. เลือกไฟล์: ESP32-Dashboard-API.postman_collection.json
4. Import Environment: ESP32-Dashboard-Local.postman_environment.json
5. เลือก Environment: "ESP32 Dashboard - Local"
```

### 2. ทดสอบ API ทีละขั้นตอน

#### ✅ Step 1: Health Check
```
GET http://localhost:5000/api/health
ผลลัพธ์ที่คาดหวัง: Status 200, "ESP32 Dashboard API is running"
```

#### ✅ Step 2: ดูข้อมูล Sensor ปัจจุบัน
```
GET http://localhost:5000/api/sensor-data
ผลลัพธ์: จะได้ temperature, humidity, และ timestamp
```

#### ✅ Step 3: ส่งข้อมูล Sensor จำลอง
```
POST http://localhost:5000/api/sensor-data
Body (JSON):
{
  "temperature": 28.5,
  "humidity": 70.3
}
```

#### ✅ Step 4: ทดสอบควบคุม LED
```
# ดูสถานะ LED
GET http://localhost:5000/api/led-status

# เปิด LED
POST http://localhost:5000/api/led-control
Body: {"status": true}

# ปิด LED  
POST http://localhost:5000/api/led-control
Body: {"status": false}
```

## การทดสอบแบบอัตโนมัติ

### เพิ่ม Tests ใน Postman
ใน tab "Tests" ของแต่ละ request สามารถเพิ่ม JavaScript เพื่อตรวจสอบ response:

```javascript
// ตรวจสอบ status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// ตรวจสอบ response มี success = true
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

// ตรวจสอบข้อมูล temperature (สำหรับ sensor data)
pm.test("Temperature is a number", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.temperature).to.be.a('string');
    pm.expect(parseFloat(jsonData.data.temperature)).to.be.a('number');
});
```

## URL สำหรับทดสอบด่วน

หากไม่ต้องการใช้ Postman สามารถเปิด browser และเข้า URL เหล่านี้:

- **Health Check**: http://localhost:5000/api/health
- **Sensor Data**: http://localhost:5000/api/sensor-data  
- **LED Status**: http://localhost:5000/api/led-status
- **API Status**: http://localhost:5000/api/status

## การใช้งานจริงกับ ESP32

เมื่อเชื่อมต่อ ESP32 จริง:
1. ESP32 จะส่งข้อมูลมาที่: `POST /api/sensor-data`
2. ESP32 จะเช็คสถานะ LED ที่: `GET /api/esp32/led-status`
3. Dashboard จะควบคุม LED ผ่าน: `POST /api/led-control`

## Troubleshooting เบื้องต้น

### ปัญหา: Cannot connect to localhost:5000
```powershell
# ตรวจสอบว่า server รันอยู่หรือไม่
netstat -an | findstr :5000

# หากไม่รัน ให้เริ่ม server
cd d:\GitHub\DashboardDemoBasic
npm start
```

### ปัญหา: Server ไม่ตอบสนอง  
```powershell
# ตรวจสอบ process ที่ใช้ port 5000
netstat -ano | findstr :5000
```

*🌱 Ready to use สำหรับ Smart Farming Project!*
