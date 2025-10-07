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