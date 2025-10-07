# 🌤️ Weather Forecast Feature

## การเพิ่มพยากรณ์อากาศนครศรีธรรมราชใน ESP32 IoT Dashboard

### ✨ ฟีเจอร์ใหม่ที่เพิ่มเข้ามา

#### 🌡️ **ข้อมูลอากาศปัจจุบัน**
- **อุณหภูมิ**: แสดงอุณหภูมิปัจจุบันในหน่วยเซลเซียส
- **สภาพอากาศ**: แสดงรูปภาพและคำอธิบายสภาพอากาศ
- **ความชื้น**: เปอร์เซ็นต์ความชื้นในอากาศ  
- **ความเร็วลม**: ความแรงลมใน km/h
- **ค่า UV Index**: ระดับรังสี UV (หากมีข้อมูล)

#### 📅 **พยากรณ์อากาศ 3 วัน**
- แสดงวันที่และวันในสัปดาห์
- ไอคอนสภาพอากาศสำหรับแต่ละวัน
- อุณหภูมิสูงสุด/ต่ำสุด
- ความชื้นเฉลี่ย

### 🔧 **Technical Implementation**

#### API Integration
```javascript
// Weather API Configuration
const WEATHER_API_KEY = '9c8b4eab85674edd8cf204847241007';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

// API Endpoints ที่ใช้:
// 1. Current Weather: /current.json
// 2. 3-Day Forecast: /forecast.json
```

#### State Management
```javascript
const [weatherData, setWeatherData] = useState(null);
const [weatherForecast, setWeatherForecast] = useState([]);
```

#### Auto-refresh
- **ข้อมูลปัจจุบัน**: อัปเดตทุก 5 นาที
- **พยากรณ์อากาศ**: อัปเดตทุก 5 นาที
- **Fallback**: ใช้ข้อมูลจำลองเมื่อไม่สามารถเชื่อมต่อ API ได้

### 🎨 **UI/UX Design**

#### Weather Card Layout
- **การ์ดหลัก**: พื้นหลังสีฟ้าอ่อน เข้ากับธีมเกษตรกรรม
- **แถบสีด้านบน**: Gradient ฟ้า-เทอร์คอยซ์
- **ไอคอนสภาพอากาศ**: รูปภาพจาก WeatherAPI
- **Typography**: ใช้ฟอนต์ที่อ่านง่าย

#### Responsive Design
```css
.weather-current {
  display: flex;
  align-items: center;
  gap: 20px;
}

.forecast-items {
  display: flex;
  gap: 15px;
  justify-content: space-between;
}
```

### 📊 **ประโยชน์สำหรับการเกษตร**

#### 🌱 **การวางแผนการเกษตร**
- **ความชื้น**: วางแผนการรดน้ำ
- **อุณหภูมิ**: เลือกช่วงเวลาทำงานในสวน
- **UV Index**: ป้องกันตัวจากแสงแดด

#### 🚜 **การจัดการฟาร์ม**
- **พยากรณ์ฝน**: เตรียมระบบระบายน้ำ
- **ความเร็วลม**: วางแผนการพ่นยา
- **อุณหภูมิ**: ปรับระบบระบายอากาศเรือนกระจก

### 🔄 **Data Flow**

```
1. Dashboard Load → fetchWeatherData()
2. API Call → WeatherAPI.com
3. Response Processing → State Update
4. UI Render → Weather Card Display
5. Auto Refresh → Every 5 minutes
```

### 🛡️ **Error Handling**

#### Fallback Data
เมื่อไม่สามารถเชื่อมต่อ API ได้ จะใช้ข้อมูลจำลอง:
```javascript
// Mock data for demonstration
setWeatherData({
  location: { name: 'นครศรีธรรมราช', country: 'ประเทศไทย' },
  current: {
    temp_c: 28,
    condition: { text: 'เมฆบางส่วน' },
    humidity: 75,
    wind_kph: 12,
    uv: 6
  }
});
```

### 🚀 **การใช้งาน**

#### ข้อมูลที่แสดง
- **🌤️ สภาพอากาศปัจจุบัน**: อุณหภูมิ, ความชื้น, ลม, UV
- **📅 พยากรณ์ 3 วัน**: อุณหภูมิสูงสุด/ต่ำสุด, ความชื้นเฉลี่ย
- **🏃‍♂️ Real-time Update**: อัปเดตทุก 5 นาทีอัตโนมัติ

#### การตีความข้อมูล
- **อุณหภูมิ > 35°C**: ร้อนมาก ควระวังการทำงานกลางแจ้ง
- **ความชื้น > 80%**: อากาศชื้น อาจมีฝน
- **UV > 8**: รังสี UV สูง ควรหลีกเลี่ยงแสงแดดจัด
- **ลม > 20 km/h**: ลมแรง ไม่เหมาะพ่นยา

### 🔗 **Integration กับ IoT Data**

#### เปรียบเทียบข้อมูล
- **อุณหภูมิในร่ม vs นอกร่ม**: เซ็นเซอร์ vs พยากรณ์อากาศ
- **ความชื้น**: ข้อมูลดิน vs อากาศ
- **การตัดสินใจ**: รวมข้อมูลทั้งสองแหล่งเพื่อการจัดการที่ดีขึ้น

### 📱 **Mobile Responsive**

Weather Card ถูกออกแบบให้ทำงานได้ดีบนทุกอุปกรณ์:
- **Desktop**: แสดงข้อมูลครบถ้วน
- **Tablet**: ปรับ layout ให้เหมาะสม
- **Mobile**: แสดงข้อมูลสำคัญที่สุด

### 🎯 **Future Enhancements**

#### เพิ่มเติมในอนาคต
- **แจ้งเตือนสภาพอากาศเลวร้าย**
- **กราฟแนวโน้มอุณหภูมิ 7 วัน**
- **คำแนะนำการเกษตรตามสภาพอากาศ**
- **การบันทึกข้อมูลเพื่อวิเคราะห์ประจำปี**