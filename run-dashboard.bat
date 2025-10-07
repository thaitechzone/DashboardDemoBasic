@echo off
echo ========================================
echo    Smart Farm Dashboard Launcher
echo ========================================
echo.

echo [1/3] กำลังตรวจสอบ Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js ไม่ได้ติดตั้งในระบบ
    echo โปรดติดตั้ง Node.js จาก https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js พบแล้ว

echo.
echo [2/3] กำลังติดตั้ง Dependencies...
if not exist "node_modules" (
    echo กำลังติดตั้ง packages สำหรับ frontend...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Error: ไม่สามารถติดตั้ง dependencies ได้
        pause
        exit /b 1
    )
)

echo.
echo [3/3] กำลังเริ่มระบบ...
echo.
echo 🚀 เริ่มต้น Backend API Server (Port 5000)...
start "Backend API" cmd /c "cd server && node server.js && pause"

echo.
echo ⏳ รอ Backend เริ่มทำงาน (3 วินาที)...
timeout /t 3 >nul

echo.
echo 🌐 เริ่มต้น Frontend Dashboard (Port 3001)...
start "Frontend Dashboard" cmd /c "npm run dev && pause"

echo.
echo ========================================
echo        ✅ ระบบเริ่มทำงานแล้ว!
echo ========================================
echo.
echo 🌐 Dashboard:     http://localhost:3001
echo 🔧 Backend API:   http://localhost:5000
echo 📊 Health Check:  http://localhost:5000/api/health
echo.
echo 💡 Tips:
echo - กดปุ่ม Ctrl+C เพื่อหยุดการทำงาน
echo - ปิด Command Prompt windows เพื่อหยุดระบบ
echo - ตรวจสอบ Postman Collection ในโฟลเดอร์ postman-collection/
echo.

echo กดปุ่มใดๆ เพื่อเปิด Dashboard ใน Browser...
pause >nul
start http://localhost:3001

echo.
echo 🎯 กำลังเปิด Dashboard...
echo คุณสามารถปิดหน้าต่างนี้ได้แล้ว
echo.
pause