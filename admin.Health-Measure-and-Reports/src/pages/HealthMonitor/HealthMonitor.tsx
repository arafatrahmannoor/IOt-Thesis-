import { useEffect, useState } from "react";
import { connectSocket } from "../../utils/socketService";
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

function HealthMonitor() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [dataHistory, setDataHistory] = useState<HealthData[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    // Connect to socket
    const socket = connectSocket();

    // Check initial connection status
    if (socket.connected) {
      setIsConnected(true);
      // Already connected to health monitor
    } else {
      setIsConnected(false);
      // Waiting for socket connection...
    }

    const handleConnect = () => {
      setIsConnected(true);
      // Successfully connected to health monitor
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      // Disconnected from health monitor
    };

    const handleLatestMeasurement = (data: HealthData) => {
      setHealthData(data);
      setLastUpdate(new Date());
      // Add to history (keep last 10 records)
      setDataHistory((prev) => {
        const newHistory = [data, ...prev];
        setTotalRecords((count) => count + 1);
        return newHistory.slice(0, 10);
      });
      // Latest measurement received from Arduino
    };

    const handleHealthData = (data: HealthData) => {
      setHealthData(data);
      setLastUpdate(new Date());
      // Add to history (keep last 10 records)
      setDataHistory((prev) => {
        const newHistory = [data, ...prev];
        setTotalRecords((count) => count + 1);
        return newHistory.slice(0, 10);
      });
      // Health data received from Arduino device
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("latest-measurement", handleLatestMeasurement);
    socket.on("health-data", handleHealthData);

    // Cleanup on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("latest-measurement", handleLatestMeasurement);
      socket.off("health-data", handleHealthData);
    };
  }, []);

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

   const getStatusBadge = (isOnline: boolean) => {
     return (
       <span
         className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
           isOnline
             ? "bg-green-100 text-green-800"
             : "bg-red-100 text-red-800"
         }`}
       >
         {isOnline ? (
           <FiCheckCircle className="w-3.5 h-3.5" />
         ) : (
           <FiXCircle className="w-3.5 h-3.5" />
         )}
         {isOnline ? "Online" : "Offline"}
       </span>
     );
   };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Monitor</h1>
            <p className="text-gray-600 mt-1">Real-time health data from ESP32</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
               <div className="text-sm text-gray-500">Connection Status</div>
               <div className="flex items-center gap-2 justify-end">
                 {isConnected ? (
                   <FiCheckCircle className="w-5 h-5 text-green-600" />
                 ) : (
                   <FiXCircle className="w-5 h-5 text-red-600" />
                 )}
                 <span
                   className={`text-lg font-semibold ${
                     isConnected ? "text-green-600" : "text-red-600"
                   }`}
                 >
                   {isConnected ? "Connected" : "Disconnected"}
                 </span>
               </div>
             </div>
             {lastUpdate && (
               <div className="text-right">
                 <div className="text-sm text-gray-500">Last Update</div>
                 <div className="flex items-center gap-2 justify-end">
                   <FiClock className="w-4 h-4 text-gray-400" />
                   <span className="text-lg font-semibold text-gray-900">
                     {formatTime(lastUpdate)}
                   </span>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {!healthData ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="space-y-4">
            <div className={`text-lg font-semibold ${
              isConnected ? "text-blue-600" : "text-red-600"
            }`}>
              {isConnected
                ? "⏳ Waiting for data from Arduino..."
                : "❌ Not connected to server"}
            </div>
            {!isConnected && (
              <div className="text-sm text-gray-500 space-y-2">
                <p>Server URL: http://localhost:5001</p>
                <p>Please check:</p>
                <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-1">
                  <li>Backend server is running on port 5001</li>
                  <li>Socket.IO is properly initialized</li>
                  <li>Browser console for connection errors</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Main Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Temperature Card */}
             <div className="bg-white rounded-xl border p-6">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-medium text-gray-600">Temperature</h3>
                 <div className="p-2 bg-red-50 rounded-lg">
                   <FiThermometer className="w-5 h-5 text-red-600" />
                 </div>
               </div>
              <div className="space-y-2">
                <div
                  className={`text-3xl font-bold ${getStatusColor(
                    healthData.temperatureC,
                    36,
                    37.5
                  )}`}
                >
                  {healthData.temperatureC.toFixed(1)}°C
                </div>
                <div className="text-lg text-gray-500">
                  {healthData.temperatureF.toFixed(1)}°F
                </div>
              </div>
            </div>

             {/* SpO2 Card */}
             <div className="bg-white rounded-xl border p-6">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-medium text-gray-600">SpO2</h3>
                 <div className="p-2 bg-blue-50 rounded-lg">
                   <FiActivity className="w-5 h-5 text-blue-600" />
                 </div>
               </div>
              <div className="space-y-2">
                <div
                  className={`text-3xl font-bold ${getStatusColor(
                    healthData.spo2,
                    95,
                    100
                  )}`}
                >
                  {healthData.spo2}%
                </div>
                <div className="text-sm text-gray-500">Blood Oxygen</div>
              </div>
            </div>

             {/* Heart Rate Card */}
             <div className="bg-white rounded-xl border p-6">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-medium text-gray-600">Heart Rate</h3>
                 <div className="p-2 bg-pink-50 rounded-lg">
                   <FiHeart className="w-5 h-5 text-pink-600" />
                 </div>
               </div>
              <div className="space-y-2">
                <div
                  className={`text-3xl font-bold ${getStatusColor(
                    healthData.heartRate,
                    60,
                    100
                  )}`}
                >
                  {healthData.heartRate} BPM
                </div>
                <div className="text-sm text-gray-500">Beats per minute</div>
              </div>
            </div>

             {/* WiFi Signal Card */}
             <div className="bg-white rounded-xl border p-6">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-medium text-gray-600">WiFi Signal</h3>
                 <div className="p-2 bg-purple-50 rounded-lg">
                   <FiWifi className="w-5 h-5 text-purple-600" />
                 </div>
               </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {healthData.wifiSignalStrength || "N/A"}
                </div>
                <div className="text-sm text-gray-500">dBm</div>
              </div>
            </div>
          </div>

          {/* Device Status & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Device Status */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Device Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Device ID</span>
                  <span className="font-medium text-gray-900">
                    {healthData.deviceId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Online Status</span>
                  {getStatusBadge(healthData.isOnline)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Internet Connection</span>
                  {getStatusBadge(healthData.hasInternet)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Measurement</span>
                  <span className="font-medium text-gray-900">
                    {formatTime(healthData.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Summary */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-semibold text-gray-900">
                    {healthData.temperatureC.toFixed(1)}°C /{" "}
                    {healthData.temperatureF.toFixed(1)}°F
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">SpO2 Level</span>
                  <span className="font-semibold text-gray-900">
                    {healthData.spo2}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Heart Rate</span>
                  <span className="font-semibold text-gray-900">
                    {healthData.heartRate} BPM
                  </span>
                </div>
                {healthData.wifiSignalStrength && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">WiFi Signal</span>
                    <span className="font-semibold text-gray-900">
                      {healthData.wifiSignalStrength} dBm
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Data Table */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Real-time Data History
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Showing last
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {dataHistory.length}
                </span>
                <span className="text-sm text-gray-500">
                  of
                </span>
                <span className="text-sm font-semibold text-primary-600">
                  {totalRecords}
                </span>
                <span className="text-sm text-gray-500">
                  total records
                </span>
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '500px' }}>
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Temperature</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SpO2</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Heart Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">WiFi Signal</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No data captured yet. Waiting for measurements...
                      </td>
                    </tr>
                  ) : (
                    dataHistory.map((record, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === 0 ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                          {formatTime(record.timestamp)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {record.temperatureC.toFixed(1)}°C
                            </span>
                            <span className="text-gray-500 text-xs">
                              ({record.temperatureF.toFixed(1)}°F)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`font-semibold ${getStatusColor(
                              record.spo2,
                              95,
                              100
                            )}`}
                          >
                            {record.spo2}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`font-semibold ${getStatusColor(
                              record.heartRate,
                              60,
                              100
                            )}`}
                          >
                            {record.heartRate} BPM
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {record.wifiSignalStrength ? (
                            <span>{record.wifiSignalStrength} dBm</span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            {record.isOnline ? (
                              <FiCheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <FiXCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-xs text-gray-600">
                              {record.isOnline ? "Online" : "Offline"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HealthMonitor;

