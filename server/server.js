const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for sensor data (in production, use a database)
let sensorData = [];
let ledStatus = false;
let esp32Status = 'offline';

// Store last 50 readings for chart
const MAX_READINGS = 50;

// Mock data generator (for testing without ESP32)
const generateMockData = () => {
  return {
    temperature: (20 + Math.random() * 15).toFixed(1), // 20-35°C
    humidity: (40 + Math.random() * 40).toFixed(1),    // 40-80%
    timestamp: new Date().toISOString()
  };
};

// Routes

// Get current sensor data
app.get('/api/sensor-data', (req, res) => {
  const currentData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : generateMockData();
  
  res.json({
    success: true,
    data: currentData,
    status: esp32Status,
    ledStatus: ledStatus
  });
});

// Get historical sensor data for charts
app.get('/api/sensor-history', (req, res) => {
  res.json({
    success: true,
    data: sensorData.slice(-MAX_READINGS), // Return last 50 readings
    count: sensorData.length
  });
});

// ESP32 endpoint to send sensor data
app.post('/api/sensor-data', (req, res) => {
  const { temperature, humidity } = req.body;
  
  if (temperature === undefined || humidity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Temperature and humidity are required'
    });
  }

  const newReading = {
    temperature: parseFloat(temperature).toFixed(1),
    humidity: parseFloat(humidity).toFixed(1),
    timestamp: new Date().toISOString()
  };

  // Add new reading and maintain max size
  sensorData.push(newReading);
  if (sensorData.length > MAX_READINGS) {
    sensorData = sensorData.slice(-MAX_READINGS);
  }

  // Update ESP32 status
  esp32Status = 'online';

  console.log(`New sensor data: ${temperature}°C, ${humidity}%`);

  res.json({
    success: true,
    message: 'Data received successfully',
    data: newReading
  });
});

// Get LED status
app.get('/api/led-status', (req, res) => {
  res.json({
    success: true,
    ledStatus: ledStatus,
    message: ledStatus ? 'LED is ON' : 'LED is OFF'
  });
});

// Control LED
app.post('/api/led-control', (req, res) => {
  const { status } = req.body;
  
  if (typeof status !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Status must be boolean (true/false)'
    });
  }

  ledStatus = status;
  
  console.log(`LED ${status ? 'turned ON' : 'turned OFF'}`);

  res.json({
    success: true,
    ledStatus: ledStatus,
    message: `LED ${status ? 'turned ON' : 'turned OFF'}`
  });
});

// ESP32 endpoint to get LED status
app.get('/api/esp32/led-status', (req, res) => {
  res.json({
    ledStatus: ledStatus ? 1 : 0
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ESP32 Dashboard API is running',
    timestamp: new Date().toISOString(),
    esp32Status: esp32Status,
    ledStatus: ledStatus
  });
});

// Status check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    esp32Status: esp32Status,
    ledStatus: ledStatus,
    dataPoints: sensorData.length,
    lastUpdate: sensorData.length > 0 ? sensorData[sensorData.length - 1].timestamp : null
  });
});

// Generate mock data for demo (remove this in production)
const generateMockDataInterval = () => {
  if (esp32Status === 'offline') {
    const mockData = generateMockData();
    sensorData.push(mockData);
    if (sensorData.length > MAX_READINGS) {
      sensorData = sensorData.slice(-MAX_READINGS);
    }
    console.log(`Mock data generated: ${mockData.temperature}°C, ${mockData.humidity}%`);
  }
};

// Generate mock data every 5 seconds for demo
setInterval(generateMockDataInterval, 5000);

// Check ESP32 connection status (mark offline if no data received for 30 seconds)
setInterval(() => {
  if (sensorData.length > 0) {
    const lastUpdate = new Date(sensorData[sensorData.length - 1].timestamp);
    const now = new Date();
    const timeDiff = (now - lastUpdate) / 1000; // seconds
    
    if (timeDiff > 30) {
      esp32Status = 'offline';
      console.log('ESP32 marked as offline - no data received for 30 seconds');
    }
  }
}, 10000); // Check every 10 seconds

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ESP32 Dashboard API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Sensor data: http://localhost:${PORT}/api/sensor-data`);
  console.log(`💡 LED control: http://localhost:${PORT}/api/led-control`);
});