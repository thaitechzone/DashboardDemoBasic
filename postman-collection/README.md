# ESP32 Dashboard API - Postman Testing Guide

## การติดตั้งและใช้งาน Postman

### 1. ดาวน์โหลด Postman
- ไปที่ https://www.postman.com/downloads/
- ดาวน์โหลดและติดตั้ง Postman สำหรับ Windows

### 2. Import Collection และ Environment

#### Import Collection:
1. เปิด Postman
2. คลิก **Import** (มุมซ้ายบน)
3. เลือก **Upload Files**
4. เลือกไฟล์ `ESP32-Dashboard-API.postman_collection.json`
5. คลิก **Import**

#### Import Environment:
1. คลิก **Import** อีกครั้ง
2. เลือกไฟล์ `ESP32-Dashboard-Local.postman_environment.json`
3. คลิก **Import**

### 3. ตั้งค่า Environment
1. คลิกที่ **Environment** dropdown (มุมขวาบน)
2. เลือก **ESP32 Dashboard - Local**

### 4. เริ่มต้นการทดสอบ

#### ตรวจสอบว่า Server ทำงาน:
1. เลือก request **Health Check**
2. คลิก **Send**
3. ควรได้ response status 200 พร้อม message ว่า API กำลังทำงาน

## รายละเอียด API Endpoints

### 1. Health Check
- **Method**: GET
- **URL**: `/api/health`
- **จุดประสงค์**: ตรวจสอบว่า API server ทำงานปกติ

### 2. Get Current Sensor Data
- **Method**: GET
- **URL**: `/api/sensor-data`
- **จุดประสงค์**: รับข้อมูล sensor ปัจจุบัน (อุณหภูมิ, ความชื้น)

### 3. Get Sensor History
- **Method**: GET
- **URL**: `/api/sensor-history`
- **จุดประสงค์**: รับข้อมูล sensor ย้อนหลัง (50 รายการล่าสุด)

### 4. Send Sensor Data (ESP32 Simulation)
- **Method**: POST
- **URL**: `/api/sensor-data`
- **Body**:
  ```json
  {
    "temperature": 25.5,
    "humidity": 65.2
  }
  ```
- **จุดประสงค์**: จำลองการส่งข้อมูลจาก ESP32

### 5. Get LED Status
- **Method**: GET
- **URL**: `/api/led-status`
- **จุดประสงค์**: ตรวจสอบสถานะ LED

### 6. Turn LED ON
- **Method**: POST
- **URL**: `/api/led-control`
- **Body**:
  ```json
  {
    "status": true
  }
  ```

### 7. Turn LED OFF
- **Method**: POST
- **URL**: `/api/led-control`
- **Body**:
  ```json
  {
    "status": false
  }
  ```

### 8. ESP32 Get LED Status
- **Method**: GET
- **URL**: `/api/esp32/led-status`
- **จุดประสงค์**: Endpoint สำหรับ ESP32 ตรวจสอบสถานะ LED (คืนค่า 1 หรือ 0)

### 9. Get API Status
- **Method**: GET
- **URL**: `/api/status`
- **จุดประสงค์**: ตรวจสอบสถานะทั่วไปของ API

## วิธีการทดสอบแบบ Step-by-Step

### ขั้นตอนที่ 1: ตรวจสอบ API Server
1. ส่ง request **Health Check**
2. ตรวจสอบว่าได้ response status 200

### ขั้นตอนที่ 2: ทดสอบการอ่านข้อมูล Sensor
1. ส่ง request **Get Current Sensor Data**
2. ตรวจสอบว่าได้ข้อมูล temperature และ humidity

### ขั้นตอนที่ 3: ทดสอบการส่งข้อมูล Sensor
1. ส่ง request **Send Sensor Data (ESP32 Simulation)**
2. แก้ไขค่า temperature และ humidity ตามต้องการ
3. ตรวจสอบว่าได้ response success: true

### ขั้นตอนที่ 4: ทดสอบการควบคุม LED
1. ส่ง request **Get LED Status** เพื่อดูสถานะปัจจุบัน
2. ส่ง request **Turn LED ON**
3. ส่ง request **Get LED Status** อีกครั้งเพื่อยืนยัน
4. ส่ง request **Turn LED OFF**
5. ตรวจสอบสถานะอีกครั้ง

### ขั้นตอนที่ 5: ทดสอบ Historical Data
1. ส่งข้อมูล sensor หลายครั้งด้วย **Send Sensor Data**
2. ส่ง request **Get Sensor History** เพื่อดูข้อมูลที่เก็บไว้

## Tips การใช้งาน

### การใช้ Variables
- Collection ใช้ `{{baseUrl}}` variable
- สามารถเปลี่ยน baseUrl ใน Environment ได้

### การดู Response
- ตรวจสอบ Status Code (ควรเป็น 200 สำหรับ success)
- ดูข้อมูลใน Response Body
- ตรวจสอบ Response Time

### การทดสอบต่อเนื่อง
- ใช้ **Collection Runner** สำหรับทดสอบหลาย request พร้อมกัน
- ตั้งค่า **Tests** ใน request เพื่อตรวจสอบ response อัตโนมัติ

## Troubleshooting

### ปัญหา Connection Refused
- ตรวจสอบว่า server ทำงานอยู่บน port 5000
- รันคำสั่ง: `npm start` หรือ `node server/server.js`

### ปัญหา CORS
- API มีการตั้งค่า CORS แล้ว
- หาก browser block request ให้ใช้ Postman แทน

### ปัญหา JSON Format
- ตรวจสอบให้แน่ใจว่าส่ง JSON format ถูกต้อง
- ตั้ง Header `Content-Type: application/json`