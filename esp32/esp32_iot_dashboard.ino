#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// WiFi credentials - กรุณาเปลี่ยนเป็นข้อมูลของคุณ
const char* ssid = "YOUR_WIFI_SSID";         // ชื่อ WiFi ของคุณ
const char* password = "YOUR_WIFI_PASSWORD"; // รหัสผ่าน WiFi ของคุณ

// Server configuration - เปลี่ยน IP เป็นที่อยู่ของคอมพิวเตอร์ที่รัน server
const char* serverURL = "http://192.168.1.100:5000"; // เปลี่ยน IP ตามที่อยู่จริงของ server

// DHT22 sensor configuration
#define DHT_PIN 4          // GPIO4 สำหรับเซ็นเซอร์ DHT22
#define DHT_TYPE DHT22     // ประเภทเซ็นเซอร์
#define LED_PIN 2          // GPIO2 สำหรับ LED

// Initialize DHT sensor
DHT dht(DHT_PIN, DHT_TYPE);

// Variables
float temperature = 0.0;
float humidity = 0.0;
bool ledState = false;
unsigned long lastSensorRead = 0;
unsigned long lastServerCheck = 0;
const unsigned long sensorInterval = 2000;    // อ่านเซ็นเซอร์ทุก 2 วินาที
const unsigned long serverInterval = 3000;    // เช็ค server ทุก 3 วินาที

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  
  // Initialize DHT sensor
  dht.begin();
  
  Serial.println("=== ESP32 IoT Dashboard ===");
  Serial.println("กำลังเริ่มต้นระบบ...");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Test server connection
  testServerConnection();
  
  Serial.println("ระบบพร้อมทำงาน!");
  Serial.println("DHT22 Sensor: GPIO4");
  Serial.println("LED Control: GPIO2");
  Serial.println("========================");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi ขาดการเชื่อมต่อ กำลังเชื่อมต่อใหม่...");
    connectToWiFi();
  }
  
  // Read sensor data
  if (millis() - lastSensorRead >= sensorInterval) {
    readSensorData();
    sendSensorData();
    lastSensorRead = millis();
  }
  
  // Check LED status from server
  if (millis() - lastServerCheck >= serverInterval) {
    checkLEDStatus();
    lastServerCheck = millis();
  }
  
  delay(100); // Small delay to prevent overwhelming the system
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("กำลังเชื่อมต่อ WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("เชื่อมต่อ WiFi สำเร็จ!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("ไม่สามารถเชื่อมต่อ WiFi ได้!");
    Serial.println("กรุณาตรวจสอบชื่อและรหัสผ่าน WiFi");
  }
}

void readSensorData() {
  // Read temperature and humidity
  float newTemp = dht.readTemperature();
  float newHum = dht.readHumidity();
  
  // Check if readings are valid
  if (isnan(newTemp) || isnan(newHum)) {
    Serial.println("❌ ไม่สามารถอ่านข้อมูลจากเซ็นเซอร์ DHT22 ได้!");
    Serial.println("กรุณาตรวจสอบการต่อสาย:");
    Serial.println("- VCC -> 3.3V");
    Serial.println("- GND -> GND"); 
    Serial.println("- DATA -> GPIO4");
    return;
  }
  
  temperature = newTemp;
  humidity = newHum;
  
  // Print sensor data to Serial Monitor
  Serial.println("📊 ข้อมูลเซ็นเซอร์:");
  Serial.printf("   🌡️  อุณหภูมิ: %.1f°C\n", temperature);
  Serial.printf("   💧 ความชื้น: %.1f%%\n", humidity);
}

void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ ไม่มีการเชื่อมต่อ WiFi - ไม่สามารถส่งข้อมูลได้");
    return;
  }
  
  HTTPClient http;
  http.begin(String(serverURL) + "/api/sensor-data");
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  DynamicJsonDocument doc(1024);
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send POST request
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    if (httpResponseCode == 200) {
      Serial.println("✅ ส่งข้อมูลเซ็นเซอร์สำเร็จ");
    } else {
      Serial.printf("⚠️  Server ตอบกลับด้วยรหัส: %d\n", httpResponseCode);
    }
  } else {
    Serial.printf("❌ ไม่สามารถส่งข้อมูลได้ รหัสข้อผิดพลาด: %d\n", httpResponseCode);
    Serial.println("กรุณาตรวจสอบ:");
    Serial.println("- Server IP Address ใน serverURL");
    Serial.println("- Server กำลังทำงานอยู่หรือไม่");
    Serial.println("- Port 5000 เปิดอยู่หรือไม่");
  }
  
  http.end();
}

void checkLEDStatus() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  HTTPClient http;
  http.begin(String(serverURL) + "/api/esp32/led-status");
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    String payload = http.getString();
    
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    
    bool newLedState = doc["ledStatus"].as<int>() == 1;
    
    if (newLedState != ledState) {
      ledState = newLedState;
      digitalWrite(LED_PIN, ledState ? HIGH : LOW);
      Serial.printf("💡 LED: %s\n", ledState ? "เปิด (ON)" : "ปิด (OFF)");
    }
  } else if (httpResponseCode > 0) {
    Serial.printf("⚠️  ไม่สามารถเช็คสถานะ LED ได้ รหัส: %d\n", httpResponseCode);
  }
  
  http.end();
}

void testServerConnection() {
  Serial.println("กำลังทดสอบการเชื่อมต่อ Server...");
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ ไม่มีการเชื่อมต่อ WiFi - ไม่สามารถทดสอบ Server ได้");
    return;
  }
  
  HTTPClient http;
  http.begin(String(serverURL) + "/api/health");
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    Serial.println("✅ เชื่อมต่อ Server สำเร็จ!");
    String response = http.getString();
    Serial.println("Server Response: " + response);
  } else if (httpResponseCode > 0) {
    Serial.printf("⚠️  Server ตอบกลับด้วยรหัส: %d\n", httpResponseCode);
  } else {
    Serial.printf("❌ ไม่สามารถเชื่อมต่อ Server ได้ รหัสข้อผิดพลาด: %d\n", httpResponseCode);
    Serial.println("กรุณาตรวจสอบ:");
    Serial.println("- เปลี่ยน serverURL เป็น IP Address ของคอมพิวเตอร์ที่รัน server");
    Serial.println("- ตรวจสอบว่า server กำลังทำงานอยู่ที่ port 5000");
    Serial.println("- ตรวจสอบ Firewall และการตั้งค่าเครือข่าย");
  }
  
  http.end();
}

// Debug information printing every 30 seconds
void printDebugInfo() {
  static unsigned long lastDebug = 0;
  if (millis() - lastDebug >= 30000) {
    Serial.println("\n=== Debug Information ===");
    Serial.printf("WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
    Serial.printf("WiFi RSSI: %d dBm\n", WiFi.RSSI());
    Serial.printf("Free Heap: %d bytes\n", ESP.getFreeHeap());
    Serial.printf("Uptime: %lu seconds\n", millis() / 1000);
    Serial.printf("Temperature: %.1f°C\n", temperature);
    Serial.printf("Humidity: %.1f%%\n", humidity);
    Serial.printf("LED State: %s\n", ledState ? "ON" : "OFF");
    Serial.println("========================\n");
    lastDebug = millis();
  }
}