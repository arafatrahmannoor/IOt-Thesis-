import { useEffect, useState } from "react";
import { connectSocket, getSocket, disconnectSocket } from "../../utils/socketService";
import {
  getHighestValues,
  updateHighestValues,
  clearHighestValues,
} from "../../utils/storageService";
import { 
  FiThermometer, 
  FiActivity, 
  FiHeart, 
  FiWifi,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from "react-icons/fi";

interface HealthData {
  deviceId: string;
  temperatureC: number;
  temperatureF: number;
  spo2: number;
  heartRate: number;
  isOnline: boolean;
  hasInternet: boolean;
  wifiSignalStrength?: number;
  timestamp: string | Date;
}

interface HealthMonitorWidgetProps {
  isActive: boolean;
  onDataReceived?: (data: HealthData) => void;
}

const HealthMonitorWidget = ({ isActive, onDataReceived }: HealthMonitorWidgetProps) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [dataHistory, setDataHistory] = useState<HealthData[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Track highest values from localStorage
  const [highestValues, setHighestValues] = useState(() => {
    const stored = getHighestValues();
    return {
      temperatureC: stored?.temperatureC || 0,
      spo2: stored?.spo2 || 0,
      heartRate: stored?.heartRate || 0,
      wifiSignalStrength: stored?.wifiSignalStrength || 0,
    };
  });

  // Load highest values from localStorage on mount
  useEffect(() => {
    const stored = getHighestValues();
    if (stored) {
      setHighestValues({
        temperatureC: stored.temperatureC,
        spo2: stored.spo2,
        heartRate: stored.heartRate,
        wifiSignalStrength: stored.wifiSignalStrength,
      });
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      // Remove event listeners when monitoring stops but keep UI visible
      const socket = getSocket();
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("latest-measurement");
        socket.off("health-data");
        setIsConnected(false);
      }
      // Don't reset highest values when monitoring stops - keep them for display
      return () => {
        // Cleanup: remove listeners
        const socket = getSocket();
        if (socket) {
          socket.off("connect");
          socket.off("disconnect");
          socket.off("latest-measurement");
          socket.off("health-data");
        }
      };
    }

    const socket = connectSocket();

    if (socket.connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const updateHighestValuesLocal = (data: HealthData) => {
      // Update localStorage and state
      const updated = updateHighestValues({
        temperatureC: data.temperatureC,
        spo2: data.spo2,
        heartRate: data.heartRate,
        wifiSignalStrength: data.wifiSignalStrength || 0,
      });
      
      setHighestValues({
        temperatureC: updated.temperatureC,
        spo2: updated.spo2,
        heartRate: updated.heartRate,
        wifiSignalStrength: updated.wifiSignalStrength,
      });
    };

    const handleLatestMeasurement = (data: HealthData) => {
      setHealthData(data);
      setLastUpdate(new Date());
      updateHighestValuesLocal(data);
      setDataHistory((prev) => {
        const newHistory = [data, ...prev];
        setTotalRecords((count) => count + 1);
        if (onDataReceived) onDataReceived(data);
        return newHistory.slice(0, 10);
      });
    };

    const handleHealthData = (data: HealthData) => {
      setHealthData(data);
      setLastUpdate(new Date());
      updateHighestValuesLocal(data);
      setDataHistory((prev) => {
        const newHistory = [data, ...prev];
        setTotalRecords((count) => count + 1);
        if (onDataReceived) onDataReceived(data);
        return newHistory.slice(0, 10);
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("latest-measurement", handleLatestMeasurement);
    socket.on("health-data", handleHealthData);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("latest-measurement", handleLatestMeasurement);
      socket.off("health-data", handleHealthData);
    };
  }, [isActive, onDataReceived]);

  const formatTime = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return "text-green-600";
    if (value < min * 0.9 || value > max * 1.1) return "text-red-600";
    return "text-yellow-600";
  };

  // Show UI even when paused (isActive = false) if we have data
  if (!isActive && !healthData) return null;

  if (!healthData && isActive) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Waiting for health data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      {!isActive && healthData && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <FiClock className="w-4 h-4" />
            <span className="font-medium">Monitoring paused - Data collection stopped</span>
          </div>
        </div>
      )}
      
      {/* Main Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Temperature</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <FiThermometer className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${getStatusColor(healthData.temperatureC, 36, 37.5)}`}>
              {healthData.temperatureC.toFixed(1)}°C
            </div>
            <div className="text-sm text-gray-500">
              {healthData.temperatureF.toFixed(1)}°F
            </div>
            {highestValues.temperatureC > 0 && (
              <div className="text-xs text-primary-600 font-semibold mt-1">
                Highest: {highestValues.temperatureC.toFixed(1)}°C
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">SpO2</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiActivity className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${getStatusColor(healthData.spo2, 95, 100)}`}>
              {healthData.spo2}%
            </div>
            <div className="text-sm text-gray-500">Blood Oxygen</div>
            {highestValues.spo2 > 0 && (
              <div className="text-xs text-primary-600 font-semibold mt-1">
                Highest: {highestValues.spo2}%
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Heart Rate</h3>
            <div className="p-2 bg-pink-50 rounded-lg">
              <FiHeart className="w-4 h-4 text-pink-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${getStatusColor(healthData.heartRate, 60, 100)}`}>
              {healthData.heartRate} BPM
            </div>
            <div className="text-sm text-gray-500">Beats per minute</div>
            {highestValues.heartRate > 0 && (
              <div className="text-xs text-primary-600 font-semibold mt-1">
                Highest: {highestValues.heartRate} BPM
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">WiFi Signal</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <FiWifi className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {healthData.wifiSignalStrength || "N/A"}
            </div>
            <div className="text-sm text-gray-500">dBm</div>
            {highestValues.wifiSignalStrength > 0 && (
              <div className="text-xs text-primary-600 font-semibold mt-1">
                Highest: {highestValues.wifiSignalStrength} dBm
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data History Table */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Real-time Data History</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Showing last</span>
            <span className="font-semibold text-gray-900">{dataHistory.length}</span>
            <span className="text-gray-500">of</span>
            <span className="font-semibold text-primary-600">{totalRecords}</span>
            <span className="text-gray-500">total</span>
          </div>
        </div>
        <div className="overflow-x-auto" style={{ maxHeight: '300px' }}>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Time</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Temp</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">SpO2</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">HR</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500 text-xs">
                    No data yet
                  </td>
                </tr>
              ) : (
                dataHistory.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-xs font-mono">{formatTime(record.timestamp)}</td>
                    <td className="py-2 px-3 text-xs">{record.temperatureC.toFixed(1)}°C</td>
                    <td className={`py-2 px-3 text-xs font-semibold ${getStatusColor(record.spo2, 95, 100)}`}>
                      {record.spo2}%
                    </td>
                    <td className={`py-2 px-3 text-xs font-semibold ${getStatusColor(record.heartRate, 60, 100)}`}>
                      {record.heartRate} BPM
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {record.isOnline ? (
                        <span className="text-green-600">Online</span>
                      ) : (
                        <span className="text-red-600">Offline</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitorWidget;

