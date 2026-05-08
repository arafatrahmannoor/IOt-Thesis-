import { 
  FiWifi, 
  FiWifiOff, 
  FiGlobe,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from "react-icons/fi";

interface DeviceStatusProps {
  deviceId?: string;
  isOnline?: boolean;
  hasInternet?: boolean;
  wifiNetworkName?: string;
  wifiSignalStrength?: number;
  lastMeasurement?: Date | string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const DeviceStatus = ({
  deviceId = "ESP32_HealthMonitor",
  isOnline = false,
  hasInternet = false,
  wifiNetworkName,
  wifiSignalStrength,
  lastMeasurement,
  isLoading = false,
  onRefresh,
}: DeviceStatusProps) => {
  const formatTime = (date: Date | string | null | undefined) => {
    if (!date) return "Never";
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSignalStrengthLabel = (signal?: number) => {
    if (!signal) return "N/A";
    if (signal >= -50) return "Excellent";
    if (signal >= -60) return "Good";
    if (signal >= -70) return "Fair";
    return "Weak";
  };

  const getSignalStrengthColor = (signal?: number) => {
    if (!signal) return "text-gray-400";
    if (signal >= -50) return "text-green-600";
    if (signal >= -60) return "text-blue-600";
    if (signal >= -70) return "text-yellow-600";
    return "text-red-600";
  };

  const canStartMonitoring = isOnline && hasInternet;

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Device Status</h3>
          <p className="text-sm text-gray-500 mt-1">Arduino Connection & Network Info</p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Status"
          >
            <FiRefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Device Online Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isOnline ? "bg-green-100" : "bg-red-100"
            }`}>
              {isOnline ? (
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <FiXCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Device Status</p>
              <p className="text-xs text-gray-500">{deviceId}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              isOnline
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Internet Connection Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              hasInternet ? "bg-blue-100" : "bg-gray-100"
            }`}>
              <FiGlobe className={`w-5 h-5 ${hasInternet ? "text-blue-600" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Internet Connection</p>
              <p className="text-xs text-gray-500">
                {hasInternet ? "Connected" : "Not Connected"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              hasInternet
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {hasInternet ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* WiFi Network Info */}
        {wifiNetworkName && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <FiWifi className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">WiFi Network</p>
                <p className="text-xs text-gray-500">{wifiNetworkName}</p>
              </div>
            </div>
            {wifiSignalStrength && (
              <div className="text-right">
                <p className={`text-sm font-semibold ${getSignalStrengthColor(wifiSignalStrength)}`}>
                  {wifiSignalStrength} dBm
                </p>
                <p className="text-xs text-gray-500">
                  {getSignalStrengthLabel(wifiSignalStrength)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Last Measurement */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <FiRefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Last Measurement</p>
              <p className="text-xs text-gray-500">{formatTime(lastMeasurement)}</p>
            </div>
          </div>
        </div>

        {/* Monitoring Status */}
        <div className={`p-4 rounded-lg border-2 ${
          canStartMonitoring
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${
                canStartMonitoring ? "text-green-800" : "text-yellow-800"
              }`}>
                {canStartMonitoring ? "Ready to Monitor" : "Monitoring Disabled"}
              </p>
              <p className={`text-xs mt-1 ${
                canStartMonitoring ? "text-green-600" : "text-yellow-600"
              }`}>
                {canStartMonitoring
                  ? "Device is online and connected to internet"
                  : "Device must be online and connected to internet"}
              </p>
            </div>
            {canStartMonitoring ? (
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiXCircle className="w-5 h-5 text-yellow-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceStatus;

