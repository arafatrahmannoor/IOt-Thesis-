# Health Monitoring System

A comprehensive IoT-based health monitoring system with real-time data collection from Arduino ESP32, machine learning predictions, and a responsive admin dashboard.

## 🏗️ System Architecture

- **Arduino ESP32**: Health sensors (temperature, heart rate, SpO2)
- **Django ML API**: Machine learning predictions and data analysis
- **Node.js Backend**: Real-time API with Socket.IO and authentication
- **React Admin**: Modern dashboard for monitoring and management

## 🚀 Quick Start Commands

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB running locally

### 1. Start Django ML API
```powershell
cd "d:\Thesis Project-3\Project\Health-Measure-and-Prediction"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd app
python manage.py runserver
```
**Runs on:** `http://localhost:8000`

### 2. Start Node.js Backend
```powershell
cd "d:\Thesis Project-3\Project\server.Health-Measure-and-Reports"
npm install
npm run dev
```
**Runs on:** `http://localhost:5001`

### 3. Start React Admin Dashboard
```powershell
cd "d:\Thesis Project-3\Project\admin.Health-Measure-and-Reports"
npm install
npm run dev
```
**Runs on:** `http://localhost:5002`

## 🔐 Login Credentials

**Admin Access:**
- **URL**: `http://localhost:5002`
- **Email**: `superadmin@smartrecruit.com`
- **Password**: `password134`

## 📡 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| React Admin | `http://localhost:5002` | Dashboard Interface |
| Node.js API | `http://localhost:5001` | Backend API & Auth |
| Django ML | `http://localhost:8000` | ML Predictions |
| Login API | `http://localhost:5001/api/auth/login` | Authentication |

## 🔧 Troubleshooting

### Kill All Processes
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Check Running Services
```powershell
netstat -ano | findstr ":8000 :5001 :5002"
```

### Reset Database (if needed)
The admin user is automatically created when the Node.js server starts. No manual database setup required.

## 📱 Arduino ESP32 Setup

The Arduino device automatically connects to the Node.js backend and sends:
- Temperature readings
- Heart rate data (when finger is detected)
- SpO2 levels (when finger is detected)
- Device status and WiFi connectivity

## 🎯 Features

- **Real-time monitoring** via Socket.IO
- **ML-powered health predictions**
- **Responsive admin dashboard**
- **JWT-based authentication**
- **Live Arduino data streaming**
- **Historical data analysis**

## 📋 Development Notes

- MongoDB connection is configured in the Node.js backend
- Socket.IO handles real-time communication
- Arduino sends data every 5 seconds
- All services must run simultaneously for full functionality

---

**🚀 Start all services in order, then access the dashboard at `http://localhost:5002`**
