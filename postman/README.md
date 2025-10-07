# ESP32 Dashboard API - Postman Collection

This directory contains a Postman collection for testing the ESP32 Dashboard API endpoints.

## 📥 How to Import

1. Open Postman
2. Click **Import** button
3. Select the file `ESP32-Dashboard-API.postman_collection.json`
4. The collection will be imported with all endpoints ready to test

## 🧪 Available Endpoints

### Dashboard Endpoints

1. **Health Check** - `GET /api/health`
   - Check if the API server is running
   - Returns server status and timestamp

2. **Get Sensor Data** - `GET /api/sensor-data`
   - Get current temperature and humidity readings
   - Returns latest sensor data

3. **Get Sensor History** - `GET /api/sensor-history`
   - Get historical sensor data for charts
   - Returns last 50 readings

4. **Get LED Status** - `GET /api/led-status`
   - Get current LED status (on/off)

5. **Turn LED ON** - `POST /api/led-control`
   - Body: `{"status": true}`
   - Turns the LED on (GPIO2)

6. **Turn LED OFF** - `POST /api/led-control`
   - Body: `{"status": false}`
   - Turns the LED off (GPIO2)

7. **Get System Status** - `GET /api/status`
   - Get complete system status
   - Includes ESP32 connection, LED status, and data points

### ESP32 Endpoints

8. **ESP32 - Send Sensor Data** - `POST /api/sensor-data`
   - Body: `{"temperature": 25.5, "humidity": 65.3}`
   - Endpoint used by ESP32 to send sensor data

9. **ESP32 - Get LED Status** - `GET /api/esp32/led-status`
   - Returns LED status as 1 (ON) or 0 (OFF)
   - Used by ESP32 to check LED control commands

## 🚀 Quick Start

1. Make sure the API server is running:
   ```bash
   npm run server
   ```

2. Import the collection in Postman

3. Test the endpoints in this order:
   - Health Check (verify server is running)
   - Get Sensor Data (see mock data)
   - Turn LED ON/OFF (test control)
   - Get System Status (verify changes)

## 🔧 Configuration

The collection uses a variable:
- `base_url`: Default is `http://localhost:5000`

To change the base URL:
1. Select the collection in Postman
2. Click **Variables** tab
3. Update the `base_url` value
4. Save changes

## 📝 Example Responses

### Health Check Response
```json
{
  "success": true,
  "message": "ESP32 Dashboard API is running",
  "timestamp": "2024-10-07T14:00:00.000Z",
  "esp32Status": "offline",
  "ledStatus": false
}
```

### Sensor Data Response
```json
{
  "success": true,
  "data": {
    "temperature": "25.5",
    "humidity": "65.3",
    "timestamp": "2024-10-07T14:00:00.000Z"
  },
  "status": "offline",
  "ledStatus": false
}
```

### LED Control Response
```json
{
  "success": true,
  "ledStatus": true,
  "message": "LED turned ON"
}
```

## 🐛 Troubleshooting

**Connection Error:**
- Make sure the API server is running on port 5000
- Check if the `base_url` is correct
- Verify firewall settings

**CORS Error:**
- The server has CORS enabled by default
- If testing from browser, this shouldn't be an issue

**ESP32 Endpoints:**
- These are specifically designed for the ESP32 device
- You can test them manually to simulate ESP32 behavior
- For LED control, use the dashboard endpoints instead

## 📚 Related Documentation

- Main README: `../README.md`
- API Server: `../server/server.js`
- ESP32 Code: `../esp32/esp32_iot_dashboard.ino`

## 🤝 Contributing

When adding new API endpoints:
1. Update the Postman collection
2. Add documentation in this README
3. Test all endpoints thoroughly
