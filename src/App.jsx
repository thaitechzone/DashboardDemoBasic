import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Droplets, Lightbulb, Wifi, WifiOff, Activity, Leaf, Sun } from 'lucide-react';
import Switch from 'react-switch';
import './index.css';

const API_BASE_URL = 'http://localhost:5000/api';
const WEATHER_API_KEY = '9c8b4eab85674edd8cf204847241007'; // Free API key for demo
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

// Air Quality Index Helper Functions
const getAQILevel = (pm25) => {
  if (pm25 <= 12) return { level: 'ดี', color: '#4caf50', bgColor: 'rgba(76, 175, 80, 0.1)' };
  if (pm25 <= 35) return { level: 'ปานกลาง', color: '#ff9800', bgColor: 'rgba(255, 152, 0, 0.1)' };
  if (pm25 <= 55) return { level: 'ไม่ดีต่อสุขภาพกลุ่มเสี่ยง', color: '#f44336', bgColor: 'rgba(244, 67, 54, 0.1)' };
  if (pm25 <= 150) return { level: 'ไม่ดีต่อสุขภาพ', color: '#9c27b0', bgColor: 'rgba(156, 39, 176, 0.1)' };
  if (pm25 <= 250) return { level: 'ไม่ดีต่อสุขภาพมาก', color: '#795548', bgColor: 'rgba(121, 85, 72, 0.1)' };
  return { level: 'อันตราย', color: '#d32f2f', bgColor: 'rgba(211, 47, 47, 0.1)' };
};

const getHealthAdvice = (pm25) => {
  if (pm25 <= 12) return 'คุณภาพอากาศดี เหมาะสำหรับกิจกรรมกลางแจ้ง';
  if (pm25 <= 35) return 'คุณภาพอากาศปานกลาง กลุ่มเสี่ยงควรระวัง';
  if (pm25 <= 55) return 'กลุ่มเสี่ยงควรลดกิจกรรมกลางแจ้ง';
  if (pm25 <= 150) return 'ควรหลีกเลี่ยงกิจกรรมกลางแจ้งที่หนัก';
  return 'ควรอยู่ในร่มและสวมหน้ากากป้องกัน';
};

// Weather forecast helper functions
const getRainForecast = (chanceOfRain, willItRain) => {
  if (willItRain === 1 || chanceOfRain >= 70) return { text: 'ฝนตก', icon: '🌧️', color: '#2196f3' };
  if (chanceOfRain >= 50) return { text: 'มีฝนฟ้าคะนอง', icon: '⛈️', color: '#ff9800' };
  if (chanceOfRain >= 30) return { text: 'เมฆมาก อาจมีฝน', icon: '⛅', color: '#607d8b' };
  if (chanceOfRain >= 10) return { text: 'เมฆบางส่วน', icon: '🌤️', color: '#ffc107' };
  return { text: 'แดดใส ไม่มีฝน', icon: '☀️', color: '#ff5722' };
};

const getSunForecast = (uvIndex, maxTemp) => {
  if (uvIndex >= 8 || maxTemp >= 36) return { text: 'แดดจัดมาก', color: '#d32f2f', warning: true };
  if (uvIndex >= 6 || maxTemp >= 33) return { text: 'แดดแรง', color: '#ff5722', warning: false };
  if (uvIndex >= 3 || maxTemp >= 30) return { text: 'แดดปานกลาง', color: '#ff9800', warning: false };
  return { text: 'แดดอ่อน', color: '#4caf50', warning: false };
};

const getFarmingAdvice = (day) => {
  const rainChance = day.day.daily_chance_of_rain;
  const maxTemp = day.day.maxtemp_c;
  const uvIndex = day.day.uv || 5;
  
  if (rainChance >= 70) return '🌧️ เหมาะสำหรับพักงาน เตรียมรับน้ำฝน';
  if (rainChance >= 50) return '⛈️ ระวังฟ้าผ่า เลื่อนการพ่นยา';
  if (maxTemp >= 36) return '🔥 อากาศร้อนจัด หลีกเลี่ยงงานกลางแจ้ง';
  if (uvIndex >= 8) return '☀️ รังสี UV สูง ใส่หมวกและครีมกันแดด';
  if (rainChance <= 20 && maxTemp <= 32) return '🌱 เหมาะสำหรับงานเกษตร';
  return '🚜 เหมาะสำหรับงานทั่วไป';
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [ledStatus, setLedStatus] = useState(false);
  const [esp32Status, setEsp32Status] = useState('offline');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [airQualityData, setAirQualityData] = useState(null);

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

  // Fetch weather data for Nakhon Si Thammarat
  const fetchWeatherData = async () => {
    try {
      const currentResponse = await fetch(
        `${WEATHER_API_URL}/current.json?key=${WEATHER_API_KEY}&q=Nakhon Si Thammarat, Thailand&aqi=yes&lang=th`
      );
      
      if (!currentResponse.ok) throw new Error('Failed to fetch current weather');
      
      const currentResult = await currentResponse.json();
      setWeatherData(currentResult);

      // Extract air quality data
      if (currentResult.current.air_quality) {
        setAirQualityData(currentResult.current.air_quality);
      }

      // Fetch 3-day forecast
      const forecastResponse = await fetch(
        `${WEATHER_API_URL}/forecast.json?key=${WEATHER_API_KEY}&q=Nakhon Si Thammarat, Thailand&days=3&aqi=no&lang=th`
      );
      
      if (forecastResponse.ok) {
        const forecastResult = await forecastResponse.json();
        setWeatherForecast(forecastResult.forecast.forecastday);
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      // Use mock data for demonstration
      setWeatherData({
        location: { name: 'นครศรีธรรมราช', country: 'ประเทศไทย' },
        current: {
          temp_c: 28,
          condition: { text: 'เมฆบางส่วน', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
          humidity: 75,
          wind_kph: 12,
          uv: 6
        }
      });
      // Mock air quality data
      setAirQualityData({
        pm2_5: 25.5,
        pm10: 45.2,
        o3: 58.1,
        no2: 15.3,
        co: 233.4,
        so2: 8.7,
        us_epa_index: 2 // Moderate
      });
      
      // Mock detailed forecast data
      const today = new Date();
      const mockForecast = [
        {
          date: today.toISOString().split('T')[0],
          day: {
            maxtemp_c: 32, mintemp_c: 24,
            condition: { text: 'เมฆบางส่วน', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
            daily_chance_of_rain: 20,
            daily_will_it_rain: 0,
            maxwind_kph: 15,
            avghumidity: 70,
            uv: 7
          }
        },
        {
          date: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
          day: {
            maxtemp_c: 29, mintemp_c: 23,
            condition: { text: 'ฝนฟ้าคะนอง', icon: '//cdn.weatherapi.com/weather/64x64/day/200.png' },
            daily_chance_of_rain: 75,
            daily_will_it_rain: 1,
            maxwind_kph: 22,
            avghumidity: 85,
            uv: 4
          }
        },
        {
          date: new Date(today.getTime() + 172800000).toISOString().split('T')[0],
          day: {
            maxtemp_c: 35, mintemp_c: 26,
            condition: { text: 'แดดใส', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
            daily_chance_of_rain: 5,
            daily_will_it_rain: 0,
            maxwind_kph: 12,
            avghumidity: 60,
            uv: 9
          }
        }
      ];
      setWeatherForecast(mockForecast);
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
      await Promise.all([fetchSensorData(), fetchHistoryData(), fetchWeatherData()]);
      setLoading(false);
    };

    initializeData();

    // Set up intervals for real-time updates
    const sensorInterval = setInterval(fetchSensorData, 2000); // Every 2 seconds
    const historyInterval = setInterval(fetchHistoryData, 10000); // Every 10 seconds
    const weatherInterval = setInterval(fetchWeatherData, 300000); // Every 5 minutes (includes air quality)

    return () => {
      clearInterval(sensorInterval);
      clearInterval(historyInterval);
      clearInterval(weatherInterval);
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
          <h1>� Smart Farm Dashboard</h1>
          <p>ระบบตรวจสอบสภาพแวดล้อมเพื่อการเกษตรอัจฉริยะ</p>
        </header>

        {error && (
          <div className="card error">
            <p>{error}</p>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Weather Card moved to Environmental Section below - Disabled here */}
          {false && (
            <div className="card weather-card">
              <div className="card-header">
                <Activity className="card-icon" />
                <h3 className="card-title">🌤️ พยากรณ์อากาศ นครศรีธรรมราช</h3>
              </div>
              <div className="weather-content">
                <div className="weather-current">
                  <div className="weather-temp">
                    <img 
                      src={`https:${weatherData.current.condition.icon}`} 
                      alt={weatherData.current.condition.text}
                      style={{ width: '48px', height: '48px' }}
                    />
                    <span className="weather-temp-value">{weatherData.current.temp_c}°C</span>
                  </div>
                  <div className="weather-info">
                    <p className="weather-condition">{weatherData.current.condition.text}</p>
                    <div className="weather-details">
                      <span>💧 ความชื้น: {weatherData.current.humidity}%</span>
                      <span>💨 ลม: {weatherData.current.wind_kph} km/h</span>
                      {weatherData.current.uv && <span>☀️ UV: {weatherData.current.uv}</span>}
                    </div>
                  </div>
                </div>
                
                {/* 3-Day Detailed Forecast */}
                {weatherForecast.length > 0 && (
                  <div className="weather-forecast">
                    <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                      📅 พยากรณ์อากาศ 3 วันข้างหน้า
                    </h4>
                    <div className="detailed-forecast">
                      {weatherForecast.map((day, index) => {
                        const rainForecast = getRainForecast(day.day.daily_chance_of_rain, day.day.daily_will_it_rain);
                        const sunForecast = getSunForecast(day.day.uv, day.day.maxtemp_c);
                        const farmingAdvice = getFarmingAdvice(day);
                        
                        return (
                          <div key={index} className="detailed-forecast-item">
                            <div className="forecast-header">
                              <div className="forecast-date">
                                <strong>
                                  {new Date(day.date).toLocaleDateString('th-TH', { 
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                  })}
                                </strong>
                              </div>
                              <img 
                                className="forecast-main-icon"
                                src={`https:${day.day.condition.icon}`}
                                alt={day.day.condition.text}
                              />
                            </div>
                            
                            <div className="forecast-details">
                              <div className="forecast-row">
                                <span className="forecast-label">🌡️ อุณหภูมิ:</span>
                                <span className="forecast-value">
                                  {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°C
                                </span>
                              </div>
                              
                              <div className="forecast-row">
                                <span className="forecast-label">💧 โอกาสฝน:</span>
                                <span className="forecast-value" style={{ color: rainForecast.color }}>
                                  {rainForecast.icon} {day.day.daily_chance_of_rain}% - {rainForecast.text}
                                </span>
                              </div>
                              
                              <div className="forecast-row">
                                <span className="forecast-label">☀️ แดด:</span>
                                <span className="forecast-value" style={{ 
                                  color: sunForecast.color,
                                  fontWeight: sunForecast.warning ? '600' : 'normal'
                                }}>
                                  {sunForecast.text} (UV: {day.day.uv || 'N/A'})
                                </span>
                              </div>
                              
                              <div className="forecast-row">
                                <span className="forecast-label">� ลม:</span>
                                <span className="forecast-value">
                                  {Math.round(day.day.maxwind_kph)} km/h
                                </span>
                              </div>
                              
                              <div className="farming-advice">
                                <span>{farmingAdvice}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PM2.5 Card moved to Environmental Section below - Disabled here */}
          {false && airQualityData && (
            <div className="card air-quality-card">
              <div className="card-header">
                <Activity className="card-icon" />
                <h3 className="card-title">🌬️ คุณภาพอากาศ PM2.5</h3>
              </div>
              <div className="air-quality-content">
                <div className="pm25-main">
                  <div className="pm25-value">
                    <span className="pm25-number">{Math.round(airQualityData.pm2_5)}</span>
                    <span className="pm25-unit">μg/m³</span>
                  </div>
                  <div className="aqi-status" style={{ 
                    color: getAQILevel(airQualityData.pm2_5).color,
                    backgroundColor: getAQILevel(airQualityData.pm2_5).bgColor
                  }}>
                    {getAQILevel(airQualityData.pm2_5).level}
                  </div>
                </div>
                
                <div className="air-quality-details">
                  <div className="pollutant-grid">
                    <div className="pollutant-item">
                      <span className="pollutant-label">PM10</span>
                      <span className="pollutant-value">{Math.round(airQualityData.pm10)} μg/m³</span>
                    </div>
                    <div className="pollutant-item">
                      <span className="pollutant-label">O₃</span>
                      <span className="pollutant-value">{Math.round(airQualityData.o3)} μg/m³</span>
                    </div>
                    <div className="pollutant-item">
                      <span className="pollutant-label">NO₂</span>
                      <span className="pollutant-value">{Math.round(airQualityData.no2)} μg/m³</span>
                    </div>
                    <div className="pollutant-item">
                      <span className="pollutant-label">CO</span>
                      <span className="pollutant-value">{Math.round(airQualityData.co)} μg/m³</span>
                    </div>
                  </div>
                </div>

                <div className="health-advice">
                  <p>💡 {getHealthAdvice(airQualityData.pm2_5)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ESP32 Connection Status */}
          <div className="card esp32-status-card">
            <div className="card-header">
              {esp32Status === 'online' ? <Wifi className="card-icon" /> : <WifiOff className="card-icon" />}
              <h3 className="card-title">🌐 สถานะเซ็นเซอร์ฟาร์ม</h3>
            </div>
            <div className="status-indicator">
              <div className={`status-dot ${esp32Status}`}></div>
              <span style={{ 
                color: esp32Status === 'online' ? '#66bb6a' : '#ff7043',
                fontWeight: '600' 
              }}>
                                {esp32Status === 'online' ? 'เชื่อมต่อแล้ว 🟢' : 'ไม่ได้เชื่อมต่อ 🔴'}
              </span>
            </div>
            {sensorData && (
              <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
                อัปเดตล่าสุด: {new Date(sensorData.timestamp).toLocaleString('th-TH')}
              </p>
            )}
          </div>

          {/* Temperature */}
          <div className="card temperature temperature-card">
            <div className="card-header">
              <Sun className="card-icon" />
              <h3 className="card-title">🌡️ อุณหภูมิ</h3>
            </div>
            <div className="sensor-value">
              {sensorData ? sensorData.temperature : '--'}
              <span className="sensor-unit">°C</span>
            </div>
            <div className="status-indicator">
              <Activity className="card-icon" style={{ width: '16px', height: '16px' }} />
              <span>🌡️ เซ็นเซอร์ zone 1</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="card humidity humidity-card">
            <div className="card-header">
              <Droplets className="card-icon" />
              <h3 className="card-title">💧 ความชื้น</h3>
            </div>
            <div className="sensor-value">
              {sensorData ? sensorData.humidity : '--'}
              <span className="sensor-unit">%</span>
            </div>
            <div className="status-indicator">
              <Activity className="card-icon" style={{ width: '16px', height: '16px' }} />
              <span>💧 เซ็นเซอร์ zone 1</span>
            </div>
          </div>

          {/* LED Control */}
          <div className="card led-controls led-control-card">
            <div className="card-header">
              <Leaf className="card-icon" />
              <h3 className="card-title">💡 ระบบควบคุมแสง</h3>
            </div>
            
            <div className={`led-status ${ledStatus ? 'on' : 'off'}`}>
              <div className={`led-indicator ${ledStatus ? 'on' : 'off'}`}></div>
              <span>{ledStatus ? 'เปิดแล้ว ✨' : 'ปิดอยู่ 🌑'}</span>
            </div>

            <div className="switch-container">
              <Switch
                onChange={toggleLED}
                checked={ledStatus}
                onColor="#66bb6a"
                offColor="#ff7043"
                uncheckedIcon={false}
                checkedIcon={false}
                height={30}
                width={60}
                handleDiameter={26}
              />
            </div>

            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
              💡 ระบบแสง zone1
            </p>
          </div>
        </div>

        {/* Chart */}
        {historyData.length > 0 && (
          <div className="card chart-card">
            <div className="card-header">
              <Activity className="card-icon" />
              <h3 className="card-title">📈 กราฟแสดงสภาพแวดล้อมเรียลไทม์</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
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
                    stroke="#ff9800" 
                    strokeWidth={3}
                    dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#ff9800' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#26a69a" 
                    strokeWidth={3}
                    dot={{ fill: '#26a69a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#26a69a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>
              🌱 ติดตามสภาพแวดล้อม 20 จุดล่าสุด | อัปเดตทุก 2 วินาที
            </p>
          </div>
        )}

        {/* Environmental Data Section - Combined Weather & Air Quality */}
        <div className="environmental-section">
          {/* Weather Forecast Card */}
          {weatherData && (
            <div className="card weather-card">
              <div className="card-header">
                <Activity className="card-icon" />
                <h3 className="card-title">🌤️ พยากรณ์อากาศ นครศรีธรรมราช</h3>
              </div>
              <div className="weather-content">
                <div className="weather-current">
                  <div className="weather-temp">
                    <img 
                      src={`https:${weatherData.current.condition.icon}`} 
                      alt={weatherData.current.condition.text}
                      style={{ width: '48px', height: '48px' }}
                    />
                    <span className="weather-temp-value">{weatherData.current.temp_c}°C</span>
                  </div>
                  <div className="weather-info">
                    <p className="weather-condition">{weatherData.current.condition.text}</p>
                    <div className="weather-details">
                      <span>💧 ความชื้น: {weatherData.current.humidity}%</span>
                      <span>💨 ลม: {weatherData.current.wind_kph} km/h</span>
                      {weatherData.current.uv && <span>☀️ UV: {weatherData.current.uv}</span>}
                    </div>
                  </div>
                </div>
                
                {/* 3-Day Detailed Forecast */}
                {weatherForecast.length > 0 && (
                  <div className="weather-forecast">
                    <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                      📅 พยากรณ์อากาศ 3 วันข้างหน้า
                    </h4>
                    <div className="detailed-forecast">
                      {weatherForecast.map((day, index) => {
                        const rainForecast = getRainForecast(day.day.daily_chance_of_rain, day.day.daily_will_it_rain);
                        const sunForecast = getSunForecast(day.day.uv, day.day.maxtemp_c);
                        const farmingAdvice = getFarmingAdvice(day);
                        
                        return (
                          <div key={index} className="detailed-forecast-item">
                            <div className="forecast-header">
                              <div className="forecast-date">
                                <strong>
                                  {new Date(day.date).toLocaleDateString('th-TH', { 
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                  })}
                                </strong>
                              </div>
                              <img 
                                className="forecast-main-icon"
                                src={`https:${day.day.condition.icon}`}
                                alt={day.day.condition.text}
                              />
                            </div>
                            
                            <div className="forecast-details">
                              <div className="forecast-row">
                                <span className="forecast-label">🌡️ อุณหภูมิ:</span>
                                <span className="forecast-value">
                                  {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°C
                                </span>
                              </div>
                              
                              <div className="forecast-row">
                                <span className="forecast-label">💧 โอกาสฝน:</span>
                                <span className="forecast-value" style={{ color: rainForecast.color }}>
                                  {rainForecast.icon} {day.day.daily_chance_of_rain}% - {rainForecast.text}
                                </span>
                              </div>
                              
                              <div className="forecast-row">
                                <span className="forecast-label">☀️ แดด:</span>
                                <span className="forecast-value" style={{ 
                                  color: sunForecast.color,
                                  fontWeight: sunForecast.warning ? '600' : 'normal'
                                }}>
                                  {sunForecast.text} (UV: {day.day.uv || 'N/A'})
                                </span>
                              </div>
                              
                              <div className="forecast-row">
                                <span className="forecast-label">💨 ลม:</span>
                                <span className="forecast-value">
                                  {Math.round(day.day.maxwind_kph)} km/h
                                </span>
                              </div>
                              
                              <div className="farming-advice">
                                <span>{farmingAdvice}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Air Quality PM2.5 Card */}
          {airQualityData && (
            <div className="card air-quality-card">
              <div className="card-header">
                <Activity className="card-icon" />
                <h3 className="card-title">🌬️ คุณภาพอากาศ PM2.5</h3>
              </div>
              <div className="air-quality-content">
                <div className="pm25-main">
                  <div className="pm25-value">
                    <span className="pm25-number">{Math.round(airQualityData.pm2_5)}</span>
                    <span className="pm25-unit">μg/m³</span>
                  </div>
                  <div className="aqi-status" style={{ 
                    color: getAQILevel(airQualityData.pm2_5).color,
                    backgroundColor: getAQILevel(airQualityData.pm2_5).bgColor
                  }}>
                    {getAQILevel(airQualityData.pm2_5).level}
                  </div>
                </div>
                
                <div className="air-quality-details">
                  <div className="pollutant-grid">
                    <div className="pollutant-item">
                      <span className="pollutant-label">PM10</span>
                      <span className="pollutant-value">{Math.round(airQualityData.pm10)} μg/m³</span>
                    </div>
                    <div className="pollutant-item">
                      <span className="pollutant-label">O₃</span>
                      <span className="pollutant-value">{Math.round(airQualityData.o3)} μg/m³</span>
                    </div>
                    <div className="pollutant-item">
                      <span className="pollutant-label">NO₂</span>
                      <span className="pollutant-value">{Math.round(airQualityData.no2)} μg/m³</span>
                    </div>
                    <div className="pollutant-item">
                      <span className="pollutant-label">CO</span>
                      <span className="pollutant-value">{Math.round(airQualityData.co)} μg/m³</span>
                    </div>
                  </div>
                </div>

                <div className="health-advice">
                  <p>💡 {getHealthAdvice(airQualityData.pm2_5)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;