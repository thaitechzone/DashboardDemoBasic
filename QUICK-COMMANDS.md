# Quick Setup Commands

## Windows Command Prompt
```cmd
# Clone และ Setup
git clone https://github.com/thaitechzone/DashboardDemoBasic.git
cd DashboardDemoBasic
npm install

# รันระบบ (แบบง่าย)
run-dashboard.bat
```

## PowerShell
```powershell
# Clone และ Setup  
git clone https://github.com/thaitechzone/DashboardDemoBasic.git
cd DashboardDemoBasic
npm install

# รันระบบ (แบบ PowerShell)
.\run-dashboard.ps1

# หรือรันแยกกัน
# Terminal 1
cd server; node server.js

# Terminal 2  
npm run dev
```

## Linux/macOS
```bash
# Clone และ Setup
git clone https://github.com/thaitechzone/DashboardDemoBasic.git
cd DashboardDemoBasic
npm install

# รันแยกกัน
# Terminal 1
cd server && node server.js

# Terminal 2
npm run dev

# หรือรันพร้อมกัน (ถ้ามี concurrently)
npm run dev:all
```

## Docker (Optional)
```dockerfile
# สร้าง Dockerfile สำหรับ production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000 3001
CMD ["npm", "start"]
```

## การทดสอบ API ด้วย curl
```bash
# Health Check
curl http://localhost:5000/api/health

# Get Sensor Data
curl http://localhost:5000/api/sensor-data

# Control LED
curl -X POST http://localhost:5000/api/led-control \
  -H "Content-Type: application/json" \
  -d '{"ledStatus": true}'
```