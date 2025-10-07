# การต่อวงจร ESP32 กับ DHT22 และ LED

## 📋 รายการอุปกรณ์

- ESP32 Development Board
- DHT22 Temperature & Humidity Sensor  
- LED (สีแดง หรือสีใดก็ได้)
- Resistor 220Ω (สำหรับ LED)
- Resistor 10kΩ (Pull-up สำหรับ DHT22)
- Breadboard
- สายจั๊มเปอร์ (Male to Male)

## 🔌 Wiring Diagram

```
        ESP32                    DHT22
    ┌─────────────┐         ┌─────────────┐
    │             │         │             │
    │        3.3V │─────────│ VCC         │
    │             │         │             │
    │       GPIO4 │─────────│ DATA        │
    │             │    │    │             │
    │         GND │─┐  │    │ GND         │
    └─────────────┘ │  │    └─────────────┘
                    │  │
                    │  └─── 10kΩ Resistor ── 3.3V
                    │       (Pull-up)
                    │
                    │       LED + Resistor
                    │    ┌─────────────────┐
                    │    │                 │
                    │    │    GPIO2 ──── LED (+)
                    │    │                 │
                    │    │               LED (-)
                    │    │                 │
                    │    │               220Ω
                    │    │                 │
                    └────│ GND ────────── GND
                         │                 │
                         └─────────────────┘
```

## 📝 ขั้นตอนการต่อสาย

### 1. การต่อ DHT22 Sensor

**DHT22 มี 4 ขา:**
- Pin 1: VCC (3.3V-5V)
- Pin 2: DATA  
- Pin 3: ไม่ใช้
- Pin 4: GND

**การต่อ:**
1. DHT22 VCC → ESP32 3.3V
2. DHT22 DATA → ESP32 GPIO4
3. DHT22 GND → ESP32 GND
4. **เพิ่ม Pull-up Resistor 10kΩ** ระหว่าง DATA (GPIO4) กับ 3.3V

### 2. การต่อ LED

1. LED ขาบวก (+) → ESP32 GPIO2
2. LED ขาลบ (-) → Resistor 220Ω → ESP32 GND

## 🔍 การตรวจสอบการต่อสาย

### ตรวจสอบ DHT22:
- [ ] VCC ต่อกับ 3.3V หรือ 5V
- [ ] GND ต่อกับ Ground
- [ ] DATA ต่อกับ GPIO4
- [ ] มี Pull-up resistor 10kΩ ระหว่าง DATA กับ VCC

### ตรวจสอบ LED:
- [ ] ขาบวกต่อกับ GPIO2
- [ ] ขาลบต่อผ่าน resistor 220Ω ไป GND
- [ ] ทิศทางของ LED ถูกต้อง

## ⚠️ ข้อควรระวัง

1. **ไฟฟ้า:** ตรวจสอบแรงดันก่อนเสียบ (3.3V สำหรับ DHT22)
2. **ทิศทาง:** LED มีขั้วบวกลบ ต้องต่อให้ถูกต้อง
3. **Resistor:** ใช้ resistor ป้องกันไฟฟ้าเกิน
4. **Ground:** ต่อ Ground ร่วมกันทุกอุปกรณ์

## 🧪 การทดสอบ

### ทดสอบ DHT22:
```cpp
// ใน Arduino Serial Monitor จะแสดง:
// Temperature: XX.X°C
// Humidity: XX.X%
```

### ทดสอบ LED:
```cpp
// LED ควรกะพริบหรือติด/ดับตามคำสั่ง
digitalWrite(LED_PIN, HIGH);  // LED ติด
digitalWrite(LED_PIN, LOW);   // LED ดับ
```

## 🔧 การแก้ไขปัญหาทั่วไป

### DHT22 ไม่ทำงาน:
- ตรวจสอบการต่อสาย
- ตรวจสอบ Pull-up resistor
- ใช้แรงดัน 3.3V หรือ 5V
- รอ 2-3 วินาทีก่อนอ่านค่า

### LED ไม่ติด:
- ตรวจสอบทิศทางการต่อ
- ตรวจสอบ Resistor
- ลองใช้ multimeter วัดแรงดัน

### ESP32 รีสตาร์ทเรื่อย ๆ:
- ตรวจสอบการจ่ายไฟ
- ตรวจสอบ Ground connections
- ลด delay ในโค้ด

---

**หมายเหตุ:** หากยังมีปัญหา ให้ตรวจสอบ Serial Monitor ใน Arduino IDE เพื่อดู error messages