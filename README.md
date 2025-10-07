# 🌡️ ESP32 IoT Dashboard

ระบบตรวจวัดอุณหภูมิ ความชื้น และควบคุม LED แบบเรียลไทม์ ด้วย ESP32, React Dashboard และ Node.js API

## 📋 คุณสมบัติ

- 📊 **Dashboard แบบเรียลไทม์** - แสดงข้อมูลอุณหภูมิและความชื้น
- 📈 **กราฟแสดงผล** - ติดตามการเปลี่ยนแปลงของข้อมูล
- 💡 **ควบคุม LED** - เปิด/ปิด LED ผ่านหน้าเว็บ
- 🔄 **อัปเดตอัตโนมัติ** - ข้อมูลอัปเดตทุก 2 วินาที
- 📱 **Responsive Design** - ใช้งานได้ทั้งคอมพิวเตอร์และมือถือ

## 🛠️ อุปกรณ์ที่ต้องใช้

### Hardware
- **ESP32 Development Board** (1 ชิ้น)
- **DHT22 Temperature & Humidity Sensor** (1 ชิ้น)
- **LED** (1 ดวง)
- **Resistor 220Ω** (1 ตัว) - สำหรับ LED
- **Resistor 10kΩ** (1 ตัว) - Pull-up สำหรับ DHT22
- **Breadboard และสายจั๊มเปอร์**

### Software
- **Arduino IDE** หรือ **PlatformIO**
- **Node.js** (v16 ขึ้นไป)
- **Web Browser** (Chrome, Firefox, Edge, Safari)

## 🔌 การต่อวงจร

```
ESP32 Pin Connections:
┌─────────────────────────────────────┐
│  ESP32          │  Component        │
├─────────────────────────────────────┤
│  GPIO4          │  DHT22 Data       │
│  3.3V           │  DHT22 VCC        │
│  GND            │  DHT22 GND        │
│                 │                   │
│  GPIO2          │  LED Anode (+)    │
│  GND            │  LED Cathode (-)  │
│                 │  (ผ่าน 220Ω)      │
└─────────────────────────────────────┘
```

### รายละเอียดการต่อสาย

**DHT22 Sensor:**
- VCC → ESP32 3.3V
- DATA → ESP32 GPIO4 (มี 10kΩ pull-up resistor ต่อกับ 3.3V)
- GND → ESP32 GND

**LED:**
- Anode (+) → ESP32 GPIO2
- Cathode (-) → Resistor 220Ω → ESP32 GND

## 🚀 การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

```bash
# Clone project (ถ้ามี) หรือสร้างโฟลเดอร์ใหม่
cd DashboardDemoBasic

# ติดตั้ง Node.js packages
npm install
```

### 2. เตรียม ESP32

1. เปิด Arduino IDE
2. ติดตั้ง ESP32 Board Package:
   - ไปที่ File → Preferences
   - เพิ่ม URL: `https://dl.espressif.com/dl/package_esp32_index.json`
   - ไปที่ Tools → Board → Board Manager → ค้นหา "ESP32" และติดตั้ง

3. ติดตั้ง Libraries ที่จำเป็น:
   - DHT sensor library by Adafruit
   - ArduinoJson by Benoit Blanchon

### 3. แก้ไขการตั้งค่า ESP32

เปิดไฟล์ `esp32/esp32_iot_dashboard.ino` และแก้ไข:

```cpp
// เปลี่ยนเป็นข้อมูล WiFi ของคุณ
const char* ssid = "ชื่อ_WiFi_ของคุณ";
const char* password = "รหัสผ่าน_WiFi_ของคุณ";

// เปลี่ยน IP เป็นที่อยู่ของคอมพิวเตอร์ที่รัน server
const char* serverURL = "http://192.168.1.XXX:5000";
```

**🔍 วิธีหา IP Address ของคอมพิวเตอร์:**

**Windows:**
```cmd
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
```

### 4. อัปโหลดโค้ดลง ESP32

1. เชื่อมต่อ ESP32 เข้ากับคอมพิวเตอร์
2. เลือก Board: "ESP32 Dev Module"
3. เลือก Port ที่ถูกต้อง
4. กด Upload

### 5. รันระบบ

**เรียงตามลำดับ:**

1. **เริ่ม API Server:**
```bash
npm run server
```

2. **เริ่ม Frontend (Terminal ใหม่):**
```bash
npm run dev
```

3. **หรือรันทั้งคู่พร้อมกัน:**
```bash
npm run dev:all
```

4. **เปิด Web Browser:** `http://localhost:3000`

## 📊 API Endpoints

### สำหรับ Dashboard
- `GET /api/sensor-data` - ข้อมูลเซ็นเซอร์ปัจจุบัน
- `GET /api/sensor-history` - ข้อมูลประวัติสำหรับกราฟ
- `POST /api/led-control` - ควบคุม LED
- `GET /api/status` - สถานะระบบ

### สำหรับ ESP32
- `POST /api/sensor-data` - ส่งข้อมูลเซ็นเซอร์
- `GET /api/esp32/led-status` - เช็คสถานะ LED

## 🔧 การแก้ไขปัญหา

### ESP32 เชื่อมต่อ WiFi ไม่ได้
- ตรวจสอบชื่อและรหัสผ่าน WiFi
- ตรวจสอบสัญญาณ WiFi
- ลองใช้ WiFi 2.4GHz (ESP32 ไม่รองรับ 5GHz)

### ESP32 เชื่อมต่อ Server ไม่ได้
- ตรวจสอบ IP Address ในโค้ด
- ตรวจสอบว่า Server รันอยู่ที่ port 5000
- ตรวจสอบ Firewall
- ตรวจสอบว่าอยู่ในเครือข่ายเดียวกัน

### เซ็นเซอร์ DHT22 ไม่ทำงาน
- ตรวจสอบการต่อสาย
- ตรวจสอบ Pull-up resistor 10kΩ
- ตรวจสอบแรงดัน (ใช้ 3.3V)

### Dashboard ไม่แสดงข้อมูล
- ตรวจสอบ Console ใน Browser (F12)
- ตรวจสอบว่า API Server รันอยู่
- ตรวจสอบ CORS settings

## 📁 โครงสร้างไฟล์

```
DashboardDemoBasic/
├── esp32/
│   └── esp32_iot_dashboard.ino    # Arduino code สำหรับ ESP32
├── server/
│   └── server.js                  # Express API server
├── src/
│   ├── App.jsx                    # React main component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Stylesheet
├── package.json                   # Dependencies
├── vite.config.js                # Vite configuration
├── index.html                    # HTML template
└── README.md                     # คู่มือนี้
```

## 🎯 การใช้งาน

1. **ติดตามข้อมูล:** ดูอุณหภูมิและความชื้นแบบเรียลไทม์
2. **ควบคุม LED:** ใช้สวิตช์บนหน้าเว็บเพื่อเปิด/ปิด LED
3. **ดูกราฟ:** ติดตามการเปลี่ยนแปลงข้อมูลผ่านกราฟ
4. **ตรวจสอบสถานะ:** ดูสถานะการเชื่อมต่อ ESP32

## 🔄 การพัฒนาเพิ่มเติม

### เพิ่มเซ็นเซอร์อื่น ๆ
- เพิ่ม GPIO pins ใน ESP32 code
- เพิ่ม API endpoints ใน server.js
- เพิ่ม components ใน React

### บันทึกข้อมูลในฐานข้อมูล
- เชื่อมต่อ MongoDB หรือ MySQL
- แก้ไข server.js เพื่อบันทึกข้อมูล
- เพิ่มหน้าประวัติข้อมูล

### การแจ้งเตือน
- เพิ่ม email notifications
- เพิ่ม LINE Notify
- ตั้งค่า threshold สำหรับอุณหภูมิ/ความชื้น

## 📞 การสนับสนุน

หากมีปัญหาหรือข้อสงสัย:
1. ตรวจสอบ Serial Monitor ของ ESP32
2. ตรวจสอบ Console ใน Web Browser
3. ตรวจสอบ Server logs ใน Terminal

## 📄 License

MIT License - ใช้งานได้อย่างอิสระสำหรับทุกโปรเจ็กต์

---

**Happy Coding! 🚀**