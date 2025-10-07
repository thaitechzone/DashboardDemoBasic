#!/bin/bash

# Smart Farm Dashboard Launcher for Linux/macOS
echo "========================================"
echo "   Smart Farm Dashboard Launcher"  
echo "========================================"
echo ""

# Check Node.js
echo "[1/3] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

echo ""

# Install dependencies
echo "[2/3] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing frontend packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies ready"
fi

echo ""

# Start system
echo "[3/3] Starting system..."
echo ""

echo "🚀 Starting Backend API Server (Port 5000)..."
cd server
node server.js &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting for backend to start (3 seconds)..."
sleep 3

echo "🌐 Starting Frontend Dashboard (Port 3001)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "        ✅ System is running!"
echo "========================================"
echo ""
echo "🌐 Dashboard:     http://localhost:3001"
echo "🔧 Backend API:   http://localhost:5000" 
echo "📊 Health Check:  http://localhost:5000/api/health"
echo ""
echo "💡 Tips:"
echo "- Press Ctrl+C to stop"
echo "- Check Postman Collection in postman-collection/"
echo ""

# Wait for user input to stop
echo "Press Enter to stop the system..."
read

# Kill processes
echo "🛑 Stopping system..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

echo "✅ System stopped"