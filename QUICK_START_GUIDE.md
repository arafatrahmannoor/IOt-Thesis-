# Health Monitoring System - Quick Start Guide

## 🚀 Complete System Startup Commands

### Prerequisites
- Node.js (v18+)
- Python (v3.8+) 
- MongoDB (local or cloud)
- Arduino IDE (for hardware)

### 1. Start All Services

#### Backend Server (Port 5001)
```powershell
cd "d:\Thesis Project-3\Project\server.Health-Measure-and-Reports"
npm run dev
```

#### Frontend Dashboard (Port 5003)
```powershell
cd "d:\Thesis Project-3\Project\admin.Health-Measure-and-Reports"
npm run dev
```

#### ML API Server (Port 8000)
```powershell
cd "d:\Thesis Project-3\Project\Health-Measure-and-Prediction"

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start Django server
python manage.py runserver 0.0.0.0:8000
```

#### Arduino Device
1. Open Arduino IDE
2. Load: `d:\Thesis Project-3\Project\arduino.Health-Measure-and-Reports\app\app.ino`
3. Upload to ESP32 device

### 2. Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Admin Dashboard** | http://localhost:5003 | superadmin@smartrecruit.com / password134 |
| **Backend API** | http://localhost:5001 | - |
| **ML API** | http://localhost:8000 | - |
| **Arduino Monitor** | Serial Monitor | 115200 baud |

### 3. Health Check Commands

```powershell
# Check all services are running
netstat -an | findstr ":5001 :5003 :8000"

# Test backend API
Invoke-RestMethod -Uri "http://localhost:5001" -Method GET

# Test ML API
Invoke-RestMethod -Uri "http://localhost:8000" -Method GET

# Test login
$headers = @{'Content-Type'='application/json'}
$body = '{"email":"superadmin@smartrecruit.com","password":"password134"}'
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -Headers $headers -Body $body
```

### 4. Common Issues & Fixes

#### Port Already in Use
```powershell
# Kill processes on specific ports
Get-Process -Name "node" | Where-Object { $_.CommandLine -like "*5001*" -or $_.CommandLine -like "*5003*" } | Stop-Process -Force
Get-Process -Name "python" | Where-Object { $_.CommandLine -like "*8000*" } | Stop-Process -Force
```

#### Database Connection Issues
```powershell
# Check MongoDB status (if using local MongoDB)
# Ensure MongoDB service is running
```

#### Arduino Connection Issues
- Check COM port in Arduino IDE
- Verify WiFi credentials in Arduino code
- Check Serial Monitor for connection status

### 5. Development Workflow

#### Frontend Development
```powershell
cd "d:\Thesis Project-3\Project\admin.Health-Measure-and-Reports"

# Install new packages
npm install [package-name]

# Build for production
npm run build

# Lint code
npm run lint
```

#### Backend Development
```powershell
cd "d:\Thesis Project-3\Project\server.Health-Measure-and-Reports"

# Install new packages
npm install [package-name]

# Run in production mode
npm start

# Check logs
npm run dev | tee server.log
```

#### ML API Development
```powershell
cd "d:\Thesis Project-3\Project\Health-Measure-and-Prediction"

# Activate virtual environment
.\venv\Scripts\activate

# Install new packages
pip install [package-name]
pip freeze > requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 6. System Status Verification

After starting all services, verify:

1. ✅ Backend API responding at http://localhost:5001
2. ✅ Frontend loading at http://localhost:5003  
3. ✅ ML API responding at http://localhost:8000
4. ✅ Arduino sending data (check Serial Monitor)
5. ✅ Login working with test credentials
6. ✅ Real-time data flowing in dashboard
7. ✅ Reports generation working

### 7. Production Deployment

#### Environment Variables
Update `.env` files for production:
- Frontend: Update VITE_PUBLIC_API_URL to production backend
- Backend: Update database connections and CORS origins
- ML API: Update allowed hosts and database settings

#### Build Commands
```powershell
# Frontend build
cd "d:\Thesis Project-3\Project\admin.Health-Measure-and-Reports"
npm run build

# Backend build  
cd "d:\Thesis Project-3\Project\server.Health-Measure-and-Reports"
npm run build

# ML API collectstatic
cd "d:\Thesis Project-3\Project\Health-Measure-and-Prediction"
python manage.py collectstatic
```

---

## 🛠️ Troubleshooting

### Q: Login not working?
- Verify backend is running on port 5001
- Check network tab in browser for API errors
- Confirm credentials: superadmin@smartrecruit.com / password134

### Q: No real-time data?
- Check Arduino serial monitor for WiFi connection
- Verify Arduino is sending HTTP requests to backend
- Check browser console for Socket.IO connection errors

### Q: Reports not generating?
- Ensure ML API is running on port 8000
- Check backend logs for ML API communication errors
- Verify Python virtual environment is activated

### Q: Build errors?
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Python cache: `pip cache purge`
- Update dependencies: `npm update` or `pip install --upgrade -r requirements.txt`

---

**🎯 Quick Start Summary:**
1. Run 3 terminals with the backend, frontend, and ML API commands
2. Upload Arduino code to ESP32 device  
3. Access http://localhost:5003 and login with superadmin credentials
4. Monitor real-time health data and generate reports!
