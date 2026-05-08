import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import { useGetDashboardStatsQuery } from "../../redux/features/dashboard/dashboardApi";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import ModelSelectionCard from "../../components/dashboard/ModelSelectionCard";
import HealthMonitorContainer from "../../components/dashboard/HealthMonitorContainer";
import CompletionMessage from "../../components/dashboard/CompletionMessage";
import { clearHighestValues } from "../../utils/storageService";
import { connectSocket, getSocket } from "../../utils/socketService";
import { toast } from "react-toastify";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const { error, isLoading } = useGetDashboardStatsQuery(undefined);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Device status from Arduino (real-time via socket)
  // Initial state - will be updated from socket/API
  const [deviceStatus, setDeviceStatus] = useState<{
    deviceId: string;
    isOnline: boolean;
    hasInternet: boolean;
    wifiNetworkName: string;
    wifiSignalStrength: number;
    lastMeasurement: Date;
    isInitialized: boolean; // Track if we've received any data
  }>({
    deviceId: "ESP32_HealthMonitor",
    isOnline: false,
    hasInternet: false,
    wifiNetworkName: "",
    wifiSignalStrength: 0,
    lastMeasurement: new Date(),
    isInitialized: false, // No data received yet
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [hasStartedMonitoring, setHasStartedMonitoring] = useState(false);
  const [selectedTime, setSelectedTime] = useState<number | "custom">(5);
  const [customTime, setCustomTime] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [isAutoEnded, setIsAutoEnded] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [monitoringData, setMonitoringData] = useState<any[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartMonitoring = () => {
    if (!canStartMonitoring) return;

    // Clear localStorage when starting new monitoring session
    clearHighestValues();

    setShowSkeleton(true);
    setIsMonitoring(false);
    setHasStartedMonitoring(true);

    // Show skeleton for 2 seconds, then start monitoring
    setTimeout(() => {
      setShowSkeleton(false);
      setIsMonitoring(true);

      const duration = selectedTime === "custom" ? customTime : selectedTime;
      setTimeRemaining(duration * 60); // Convert to seconds

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndMonitoring(true); // Auto-ended
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000);
  };

  const handlePauseMonitoring = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
    setIsMonitoring(false);
    setPausedTimeRemaining(timeRemaining);
    setShowModelSelection(true);
    setIsAutoEnded(false);
  };

  const handleResumeMonitoring = () => {
    setIsPaused(false);
    setIsMonitoring(true);
    setTimeRemaining(pausedTimeRemaining);
    setShowModelSelection(false);

    // Resume countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleEndMonitoring(true); // Auto-ended
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEndMonitoring = (autoEnded: boolean = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsMonitoring(false);
    setIsPaused(false);
    setShowSkeleton(false);
    setTimeRemaining(0);
    setPausedTimeRemaining(0);
    setShowModelSelection(true);
    setIsAutoEnded(autoEnded);
  };

  const handleDataReceived = (data: any) => {
    setMonitoringData((prev) => [...prev, data]);
  };

  const handleGetReport = async () => {
    console.log("🚀 Get Report button clicked - Starting direct ML API call");
    console.log("❌ NO BACKEND API CALL - Direct ML API only");

    if (!selectedModel) {
      toast.error("Please select a model");
      return;
    }

    // Validate monitoring data
    if (!monitoringData || monitoringData.length === 0) {
      toast.error("No monitoring data available. Please start monitoring first.");
      return;
    }

    try {
      setIsGeneratingReport(true);
      toast.info("Generating report with ML API (Direct call, no backend)...");

      // Calculate average values from monitoring data
      let totalTempC = 0;
      let totalSpO2 = 0;
      let totalBPM = 0;
      let validCount = 0;

      monitoringData.forEach((item: any) => {
        if (
          typeof item.temperatureC === "number" &&
          typeof item.spo2 === "number" &&
          typeof item.heartRate === "number"
        ) {
          totalTempC += item.temperatureC;
          totalSpO2 += item.spo2;
          totalBPM += item.heartRate;
          validCount++;
        }
      });

      if (validCount === 0) {
        toast.error("No valid health data found in monitoring data");
        setIsGeneratingReport(false);
        return;
      }

      // Calculate averages
      const avgTempC = totalTempC / validCount;
      const avgSpO2 = totalSpO2 / validCount;
      const avgBPM = totalBPM / validCount;

      console.log("📈 Calculated averages:", {
        Temp_C: avgTempC.toFixed(2),
        SpO2: avgSpO2.toFixed(2),
        BPM: avgBPM.toFixed(2),
      });

      // Prepare ML API request payload
      const mlApiPayload = {
        Temp_C: Number(avgTempC.toFixed(1)),
        SpO2: Math.round(avgSpO2),
        BPM: Math.round(avgBPM),
      };

      console.log("🔗 Calling ML API DIRECTLY (NO BACKEND): http://127.0.0.1:8000/profile/");
      console.log("📤 Request payload:", mlApiPayload);
      console.log("⚠️ IMPORTANT: This is a DIRECT call to ML API, NOT through backend!");

      // Call ML API directly from frontend (NO BACKEND INVOLVEMENT)
      const mlApiUrl = import.meta.env.VITE_ML_API_URL || "http://127.0.0.1:8000/profile/";
      console.log(`🌐 ML API URL: ${mlApiUrl}`);

      const mlResponse = await axios.post(mlApiUrl, mlApiPayload, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
        withCredentials: false, // Disable credentials for CORS
      });

      console.log("✅ ML API Response received (Direct call successful)");

      console.log("✅ ML API Response:", mlResponse.data);

      // Navigate to report page with ML API result
      navigate("/reports/new", {
        state: {
          model: selectedModel,
          reportData: mlResponse.data, // Direct ML API response
          inputData: mlResponse.data.input_data || mlApiPayload,
          prediction: mlResponse.data.prediction,
          probability: mlResponse.data.probability,
          averages: {
            Temp_C: avgTempC,
            SpO2: avgSpO2,
            BPM: avgBPM,
          },
          dataPoints: monitoringData.length,
          validDataPoints: validCount,
          rawData: monitoringData,
          duration: selectedTime === "custom" ? customTime : selectedTime,
          fromDashboard: true // Flag to indicate navigation from dashboard
        }
      });

      toast.success("Report generated successfully!");
      setIsGeneratingReport(false);
    } catch (error: any) {
      console.error("❌ Error calling ML API:", error);
      setIsGeneratingReport(false);

      // Handle different error types
      if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        toast.error(
          "ML API service is unavailable. Please ensure the ML server is running on http://127.0.0.1:8000"
        );
      } else if (error.response) {
        toast.error(
          error.response.data?.message ||
          `ML API error: ${error.response.status} ${error.response.statusText}`
        );
      } else {
        toast.error(
          error?.message ||
          "Failed to generate report. Please try again."
        );
      }
    }
  };

  // Fetch initial device status on mount
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const serverUrl = import.meta.env.VITE_PUBLIC_SERVER_URL || "http://localhost:5001";
        console.log("📥 Fetching initial device status from:", `${serverUrl}/api/health/status`);
        const response = await fetch(`${serverUrl}/api/health/status?deviceId=ESP32_HealthMonitor`);
        if (response.ok) {
          const result = await response.json();
          console.log("📥 Initial device status API response:", result);
          if (result.success && result.data) {
            const initialStatus = {
              deviceId: result.data.deviceId || "ESP32_HealthMonitor",
              isOnline: result.data.isOnline === true || result.data.isOnline === "true" || result.data.isOnline === 1,
              hasInternet: result.data.hasInternet === true || result.data.hasInternet === "true" || result.data.hasInternet === 1,
              wifiNetworkName: result.data.wifiNetworkName || "",
              wifiSignalStrength: result.data.wifiSignalStrength ? Number(result.data.wifiSignalStrength) : 0,
              lastMeasurement: result.data.timestamp ? new Date(result.data.timestamp) : new Date(),
              isInitialized: true, // Mark as initialized
            };
            console.log("✅ Setting initial device status:", initialStatus);
            setDeviceStatus(initialStatus);
          } else {
            console.log("⚠️ No device status data in response");
          }
        } else {
          console.error("❌ Failed to fetch initial status:", response.status);
        }
      } catch (error) {
        console.error("❌ Error fetching initial device status:", error);
      }
    };

    fetchInitialStatus();

    // Periodically check for device timeout (every 5 seconds)
    const timeoutCheckInterval = setInterval(async () => {
      try {
        const serverUrl = import.meta.env.VITE_PUBLIC_SERVER_URL || "http://localhost:5001";
        const response = await fetch(`${serverUrl}/api/health/status?deviceId=ESP32_HealthMonitor`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const isOnline = result.data.isOnline === true || result.data.isOnline === "true" || result.data.isOnline === 1;
            const hasInternet = result.data.hasInternet === true || result.data.hasInternet === "true" || result.data.hasInternet === 1;

            const currentStatus = {
              deviceId: result.data.deviceId || "ESP32_HealthMonitor",
              isOnline,
              hasInternet,
              // Clear WiFi name if offline or no internet
              wifiNetworkName: (isOnline && hasInternet && result.data.wifiNetworkName) ? result.data.wifiNetworkName : "",
              wifiSignalStrength: (isOnline && hasInternet && result.data.wifiSignalStrength) ? Number(result.data.wifiSignalStrength) : 0,
              lastMeasurement: result.data.timestamp ? new Date(result.data.timestamp) : new Date(),
              isInitialized: true,
            };

            // Always update to ensure real-time WiFi name changes are reflected
            setDeviceStatus((prev) => {
              const hasChanged =
                prev.isOnline !== currentStatus.isOnline ||
                prev.hasInternet !== currentStatus.hasInternet ||
                prev.wifiNetworkName !== currentStatus.wifiNetworkName ||
                prev.wifiSignalStrength !== currentStatus.wifiSignalStrength;

              if (hasChanged) {
                console.log("🔄 Device status changed (timeout check):", currentStatus);
                console.log("   - WiFi Name:", currentStatus.wifiNetworkName || "No WiFi (cleared)");
                return currentStatus;
              }
              return prev;
            });
          }
        }
      } catch (error) {
        console.error("❌ Error checking device status timeout:", error);
      }
    }, 2000); // Check every 2 seconds for faster real-time updates

    return () => {
      clearInterval(timeoutCheckInterval);
    };
  }, []);

  // Connect to socket and listen for device status updates
  useEffect(() => {
    const socket = connectSocket();

    console.log("🔌 Setting up device status socket listener...");
    console.log("📡 Socket connected:", socket.connected);

    // Track last device status update time for timeout detection
    let lastStatusUpdateTime = Date.now();

    const handleDeviceStatus = (data: any) => {
      console.log("📡 ===== Device status received via socket (REAL-TIME) =====");
      console.log("📦 Full data:", JSON.stringify(data, null, 2));
      console.log("   - isOnline:", data.isOnline, typeof data.isOnline);
      console.log("   - hasInternet:", data.hasInternet, typeof data.hasInternet);
      console.log("   - wifiNetworkName:", data.wifiNetworkName);
      console.log("   - wifiSignalStrength:", data.wifiSignalStrength);
      console.log("   - timestamp:", data.timestamp);

      // Update last status update time
      lastStatusUpdateTime = Date.now();

      // Force update with new data - always update for real-time WiFi name changes
      // Clear WiFi name if offline or no internet
      const isOnline = data.isOnline === true || data.isOnline === "true" || data.isOnline === 1;
      const hasInternet = data.hasInternet === true || data.hasInternet === "true" || data.hasInternet === 1;

      const updated = {
        deviceId: data.deviceId || "ESP32_HealthMonitor",
        isOnline,
        hasInternet,
        // Clear WiFi name immediately if offline or no internet
        wifiNetworkName: (isOnline && hasInternet && data.wifiNetworkName) ? data.wifiNetworkName : "",
        wifiSignalStrength: (isOnline && hasInternet && data.wifiSignalStrength) ? Number(data.wifiSignalStrength) : 0,
        lastMeasurement: data.timestamp ? new Date(data.timestamp) : new Date(),
        isInitialized: true, // Mark as initialized when real data arrives
      };

      console.log("✅ Setting device status to (REAL-TIME UPDATE):", updated);
      console.log("   - WiFi Name:", updated.wifiNetworkName || "No WiFi (cleared)");
      console.log("   - WiFi Signal:", updated.wifiSignalStrength, "dBm");
      console.log("   - Will trigger UI re-render immediately");
      setDeviceStatus(updated);
    };

    // Listen for health data to track device activity
    const handleHealthData = (data: any) => {
      // Update last status update time when health data arrives
      lastStatusUpdateTime = Date.now();
    };

    // Join health room when connected
    const handleConnect = () => {
      console.log("✅ Socket connected, joining health room...");
      if (socket) {
        socket.emit("join-health-room");
        console.log("📡 Emitted join-health-room");
      }
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected - immediately marking device as offline");
      // When socket disconnects, immediately mark device as offline and clear WiFi info
      setDeviceStatus((prev) => {
        if (prev.isInitialized) {
          console.log("⚠️ Socket disconnected - immediately updating to offline state");
          return {
            ...prev,
            isOnline: false,
            hasInternet: false,
            wifiNetworkName: "", // Clear WiFi name immediately
            wifiSignalStrength: 0, // Clear signal strength
            isInitialized: true, // Keep initialized to show offline state
          };
        }
        return prev;
      });
    };

    // Join room immediately if already connected
    if (socket.connected) {
      socket.emit("join-health-room");
      console.log("✅ Already connected, joined health-measurements room");
    }

    // Add event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("device-status", handleDeviceStatus);
    socket.on("health-data", handleHealthData);
    socket.on("latest-measurement", handleHealthData);

    console.log("✅ Device status listeners registered");

    // Real-time timeout check: If no device status update for 8 seconds, mark as offline
    const timeoutCheckInterval = setInterval(() => {
      const timeSinceLastUpdate = Date.now() - lastStatusUpdateTime;
      const timeoutThreshold = 8000; // 8 seconds

      setDeviceStatus((prev) => {
        // Only mark as offline if we were previously online and initialized
        if (prev.isInitialized && prev.isOnline && timeSinceLastUpdate > timeoutThreshold) {
          console.log("⏱️ Device timeout detected - marking as offline (real-time)");
          console.log(`   Time since last update: ${timeSinceLastUpdate}ms`);
          return {
            ...prev,
            isOnline: false,
            hasInternet: false,
            wifiNetworkName: "",
            wifiSignalStrength: 0,
            // Keep isInitialized true to show "Offline" instead of "Waiting for device"
          };
        }
        return prev;
      });
    }, 2000); // Check every 2 seconds

    return () => {
      console.log("🧹 Cleaning up device status listeners");
      clearInterval(timeoutCheckInterval);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("device-status", handleDeviceStatus);
      socket.off("health-data", handleHealthData);
      socket.off("latest-measurement", handleHealthData);
    };
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup: Clear timer and localStorage on component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      clearHighestValues();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) return <Loading text="Loading Dashboard" />;
  if (error) return <div>Error loading dashboard data</div>;

  const canStartMonitoring = deviceStatus?.isOnline && deviceStatus?.hasInternet;

  return (
    <div className="flex flex-col gap-6">
      <WelcomeCard
        deviceStatus={deviceStatus}
        selectedTime={selectedTime}
        customTime={customTime}
        isMonitoring={isMonitoring}
        isPaused={isPaused}
        timeRemaining={isPaused ? pausedTimeRemaining : timeRemaining}
        canStartMonitoring={canStartMonitoring}
        onTimeChange={setSelectedTime}
        onCustomTimeChange={setCustomTime}
        onStart={handleStartMonitoring}
        onPause={handlePauseMonitoring}
        onResume={handleResumeMonitoring}
        onStop={handleEndMonitoring}
        formatTime={formatTime}
      />

      {showModelSelection && (
        <>
          <CompletionMessage isAutoEnded={isAutoEnded} />
          <ModelSelectionCard
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onGetReport={handleGetReport}
            onResume={isPaused ? handleResumeMonitoring : undefined}
            isLoading={isGeneratingReport}
          />
        </>
      )}

      <HealthMonitorContainer
        isMonitoring={isMonitoring}
        showSkeleton={showSkeleton}
        timeRemaining={timeRemaining}
        onDataReceived={handleDataReceived}
        formatTime={formatTime}
        hasStartedMonitoring={hasStartedMonitoring}
      />

      {/* Quick Stats - Commented out for now */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Measurements */}
      {/* <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiActivity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {statistics?.measurements?.total || 0}
          </h3>
          <p className="text-sm text-gray-600">Health Measurements</p>
        </div> */}

      {/* Active Devices */}
      {/* <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiWifi className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {statistics?.devices?.active || 0}
          </h3>
          <p className="text-sm text-gray-600">Connected Devices</p>
        </div> */}

      {/* Today's Measurements */}
      {/* <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {statistics?.measurements?.today || 0}
          </h3>
          <p className="text-sm text-gray-600">Measurements Today</p>
        </div> */}

      {/* Average Temperature */}
      {/* <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiThermometer className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Average</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {statistics?.averageTemp?.toFixed(1) || "N/A"}°C
          </h3>
          <p className="text-sm text-gray-600">Temperature</p>
        </div> */}
      {/* </div> */}

      {/* Health Metrics Overview - Hidden for now */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Temperature Card */}
      {/* <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Temperature</h3>
            <FiThermometer className="w-5 h-5 text-red-600" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {statistics?.latestTemp?.toFixed(1) || "N/A"}°C
            </div>
            <p className="text-sm text-gray-500">
              Normal Range: 36.0°C - 37.5°C
            </p>
          </div>
        </div> */}

      {/* SpO2 Card */}
      {/* <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">SpO2</h3>
            <FiActivity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {statistics?.latestSpO2 || "N/A"}%
            </div>
            <p className="text-sm text-gray-500">
              Normal Range: 95% - 100%
            </p>
          </div>
        </div> */}

      {/* Heart Rate Card */}
      {/* <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Heart Rate</h3>
            <FiHeart className="w-5 h-5 text-pink-600" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {statistics?.latestHeartRate || "N/A"} BPM
            </div>
            <p className="text-sm text-gray-500">
              Normal Range: 60 - 100 BPM
            </p>
          </div>
        </div> */}
      {/* </div> */}

      {/* Device Status & Health Metrics Chart - Hidden for now */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <DeviceStatus
            deviceId={deviceStatus?.deviceId}
            isOnline={deviceStatus?.isOnline}
            hasInternet={deviceStatus?.hasInternet}
            wifiNetworkName={deviceStatus?.wifiNetworkName}
            wifiSignalStrength={deviceStatus?.wifiSignalStrength}
            lastMeasurement={deviceStatus?.lastMeasurement}
            isLoading={isDeviceStatusLoading}
            onRefresh={() => refetchDeviceStatus()}
          />
        </div>
        <div className="lg:col-span-2">
          <HealthMetricsChart />
        </div>
      </div> */}

      {/* Quick Actions - Hidden for now */}
      {/* <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/health-monitor"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiMonitor className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Real-time Monitor</h4>
              <p className="text-sm text-gray-500">View live health data</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">History</h4>
              <p className="text-sm text-gray-500">View past measurements</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Analytics</h4>
              <p className="text-sm text-gray-500">View trends & reports</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
