import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Droplets, Lightbulb, Wifi, WifiOff, Activity } from 'lucide-react';
import Switch from 'react-switch';
import './index.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [ledStatus, setLedStatus] = useState(false);
  const [esp32Status, setEsp32Status] = useState('offline');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current sensor data
  const fetchSensorData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-data`);
      if (!response.ok) throw new Error('Failed to fetch sensor data');
      
      const result = await response.json();
      if (result.success) {
        setSensorData(result.data);
        setLedStatus(result.ledStatus);
        setEsp32Status(result.status);
        setError(null);
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      console.error('Error fetching sensor data:', err);
    }
  };

  // Fetch historical data for charts
  const fetchHistoryData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-history`);
      if (!response.ok) throw new Error('Failed to fetch history data');
      
      const result = await response.json();
      if (result.success) {
        const processedData = result.data.map((item, index) => ({
          ...item,
          time: new Date(item.timestamp).toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          temperature: parseFloat(item.temperature),
          humidity: parseFloat(item.humidity),
          index: index
        }));
        setHistoryData(processedData);
      }
    } catch (err) {
      console.error('Error fetching history data:', err);
    }
  };

  // Control LED
  const toggleLED = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/led-control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: !ledStatus }),
      });

      if (!response.ok) throw new Error('Failed to control LED');
      
      const result = await response.json();
      if (result.success) {
        setLedStatus(result.ledStatus);
      }
    } catch (err) {
      setError('ไม่สามารถควบคุม LED ได้');
      console.error('Error controlling LED:', err);
    }
  };

  // Initialize data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchSensorData(), fetchHistoryData()]);
      setLoading(false);
    };

    initializeData();

    // Set up intervals for real-time updates
    const sensorInterval = setInterval(fetchSensorData, 2000); // Every 2 seconds
    const historyInterval = setInterval(fetchHistoryData, 10000); // Every 10 seconds

    return () => {
      clearInterval(sensorInterval);
      clearInterval(historyInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="dashboard">
          <div className="loading">
            <div className="spinner"></div>
            <span>กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="dashboard">
        <header className="header">
          <h1>🌡️ ESP32 IoT Dashboard</h1>
          <p>ระบบตรวจวัดอุณหภูมิ ความชื้น และควบคุม LED</p>
        </header>

        {error && (
          <div className="card error">
            <p>{error}</p>
          </div>
        )}

        <div className="dashboard-grid">
          {/* ESP32 Connection Status */}
          <div className="card">
            <div className="card-header">
              {esp32Status === 'online' ? <Wifi className="card-icon" /> : <WifiOff className="card-icon" />}
              <h3 className="card-title">สถานะการเชื่อมต่อ ESP32</h3>
            </div>
            <div className="status-indicator">
              <div className={`status-dot ${esp32Status}`}></div>
              <span style={{ 
                color: esp32Status === 'online' ? '#2ecc71' : '#e74c3c',
                fontWeight: '600' 
              }}>
                {esp32Status === 'online' ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
              </span>
            </div>
            {sensorData && (
              <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
                อัปเดตล่าสุด: {new Date(sensorData.timestamp).toLocaleString('th-TH')}
              </p>
            )}
          </div>

          {/* Temperature */}
          <div className="card temperature">
            <div className="card-header">
              <Thermometer className="card-icon" />
              <h3 className="card-title">อุณหภูมิ</h3>
            </div>
            <div className="sensor-value">
              {sensorData ? sensorData.temperature : '--'}
              <span className="sensor-unit">°C</span>
            </div>
            <div className="status-indicator">
              <Activity className="card-icon" style={{ width: '16px', height: '16px' }} />
              <span>เซ็นเซอร์ DHT22 - GPIO4</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="card humidity">
            <div className="card-header">
              <Droplets className="card-icon" />
              <h3 className="card-title">ความชื้น</h3>
            </div>
            <div className="sensor-value">
              {sensorData ? sensorData.humidity : '--'}
              <span className="sensor-unit">%</span>
            </div>
            <div className="status-indicator">
              <Activity className="card-icon" style={{ width: '16px', height: '16px' }} />
              <span>เซ็นเซอร์ DHT22 - GPIO4</span>
            </div>
          </div>

          {/* LED Control */}
          <div className="card led-controls">
            <div className="card-header">
              <Lightbulb className="card-icon" />
              <h3 className="card-title">ควบคุม LED</h3>
            </div>
            
            <div className={`led-status ${ledStatus ? 'on' : 'off'}`}>
              <div className={`led-indicator ${ledStatus ? 'on' : 'off'}`}></div>
              <span>{ledStatus ? 'เปิด' : 'ปิด'}</span>
            </div>

            <div className="switch-container">
              <Switch
                onChange={toggleLED}
                checked={ledStatus}
                onColor="#2ecc71"
                offColor="#e74c3c"
                uncheckedIcon={false}
                checkedIcon={false}
                height={30}
                width={60}
                handleDiameter={26}
              />
            </div>

            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
              LED GPIO2
            </p>
          </div>
        </div>

        {/* Chart */}
        {historyData.length > 0 && (
          <div className="card chart-card">
            <div className="card-header">
              <Activity className="card-icon" />
              <h3 className="card-title">กราฟแสดงข้อมูลแบบเรียลไทม์</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={historyData.slice(-20)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name) => [
                      `${value}${name === 'temperature' ? '°C' : '%'}`,
                      name === 'temperature' ? 'อุณหภูมิ' : 'ความชื้น'
                    ]}
                    labelFormatter={(label) => `เวลา: ${label}`}
                  />
                  <Legend 
                    formatter={(value) => value === 'temperature' ? 'อุณหภูมิ (°C)' : 'ความชื้น (%)'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#e74c3c" 
                    strokeWidth={3}
                    dot={{ fill: '#e74c3c', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#e74c3c' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3498db" 
                    strokeWidth={3}
                    dot={{ fill: '#3498db', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3498db' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>
              แสดงข้อมูล 20 จุดล่าสุด | อัปเดตทุก 2 วินาที
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;