# Smart Farm Dashboard PowerShell Launcher
# สำหรับ Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Smart Farm Dashboard Launcher" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ตรวจสอบ Node.js
Write-Host "[1/3] กำลังตรวจสอบ Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js พบแล้ว: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js ไม่ได้ติดตั้งในระบบ" -ForegroundColor Red
    Write-Host "โปรดติดตั้ง Node.js จาก https://nodejs.org" -ForegroundColor Red
    Read-Host "กดปุ่ม Enter เพื่อออก"
    exit 1
}

Write-Host ""

# ตรวจสอบและติดตั้ง Dependencies
Write-Host "[2/3] กำลังตรวจสอบ Dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "กำลังติดตั้ง packages สำหรับ frontend..." -ForegroundColor Blue
    try {
        npm install
        Write-Host "✅ Dependencies ติดตั้งสำเร็จ" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: ไม่สามารถติดตั้ง dependencies ได้" -ForegroundColor Red
        Read-Host "กดปุ่ม Enter เพื่อออก"
        exit 1
    }
} else {
    Write-Host "✅ Dependencies พร้อมใช้งาน" -ForegroundColor Green
}

Write-Host ""

# เริ่มระบบ
Write-Host "[3/3] กำลังเริ่มระบบ..." -ForegroundColor Yellow
Write-Host ""

# เริ่ม Backend
Write-Host "🚀 เริ่มต้น Backend API Server (Port 5000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; Write-Host 'Backend API Server' -ForegroundColor Green; node server.js"

# รอ Backend เริ่มทำงาน
Write-Host "⏳ รอ Backend เริ่มทำงาน (3 วินาที)..." -ForegroundColor Blue
Start-Sleep -Seconds 3

# เริ่ม Frontend  
Write-Host "🌐 เริ่มต้น Frontend Dashboard (Port 3001)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Frontend Dashboard' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "        ✅ ระบบเริ่มทำงานแล้ว!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Dashboard:     http://localhost:3001" -ForegroundColor Cyan
Write-Host "🔧 Backend API:   http://localhost:5000" -ForegroundColor Cyan  
Write-Host "📊 Health Check:  http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "- กดปุ่ม Ctrl+C เพื่อหยุดการทำงาน" -ForegroundColor Gray
Write-Host "- ปิด PowerShell windows เพื่อหยุดระบบ" -ForegroundColor Gray
Write-Host "- ตรวจสอบ Postman Collection ในโฟลเดอร์ postman-collection/" -ForegroundColor Gray
Write-Host ""

# เปิด Dashboard
Write-Host "🎯 กำลังเปิด Dashboard ใน Browser..." -ForegroundColor Magenta
Start-Sleep -Seconds 2
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "คุณสามารถปิดหน้าต่างนี้ได้แล้ว Dashboard กำลังทำงานใน background" -ForegroundColor Green
Read-Host "กดปุ่ม Enter เพื่อเสร็จสิ้น"