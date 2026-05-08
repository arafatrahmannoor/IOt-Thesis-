import { useEffect } from "react";
import { FiWifi, FiGlobe } from "react-icons/fi";

interface DeviceStatusIndicatorsProps {
  isOnline: boolean;
  hasInternet: boolean;
  wifiNetworkName?: string;
  wifiSignalStrength?: number;
  isInitialized?: boolean; // New prop to check if data is initialized
}

const DeviceStatusIndicators = ({
  isOnline,
  hasInternet,
  wifiNetworkName,
  wifiSignalStrength,
  isInitialized = false,
}: DeviceStatusIndicatorsProps) => {
  // Debug: Log props to see if they're updating (only log when values change)
  useEffect(() => {
    console.log("🔍 DeviceStatusIndicators props updated:", {
      isOnline,
      hasInternet,
      wifiNetworkName,
      wifiSignalStrength,
      isInitialized,
    });
  }, [isOnline, hasInternet, wifiNetworkName, wifiSignalStrength, isInitialized]);

  // Show loading state if not initialized
  if (!isInitialized) {
    return (
      <div className="flex flex-wrap items-center gap-4 mt-4">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg opacity-50">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Waiting for device...</span>
        </div>
      </div>
    );
  }

  // Show offline state if initialized but offline (real-time update)
  if (isInitialized && !isOnline) {
    return (
      <div className="flex flex-wrap items-center gap-4 mt-4">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Waiting for device...</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg opacity-50">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-sm font-medium">Arduino: Offline</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mt-4">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        {isOnline ? (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        ) : (
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        )}
        <span className="text-sm font-medium">
          Arduino: {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        <FiGlobe className={`w-4 h-4 ${hasInternet ? "text-green-400" : "text-red-400"}`} />
        <span className="text-sm font-medium">
          Internet: {hasInternet ? "Connected" : "Disconnected"}
        </span>
      </div>

      {wifiNetworkName ? (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <FiWifi className="w-4 h-4" />
          <span className="text-sm font-medium">{wifiNetworkName}</span>
          {wifiSignalStrength !== undefined && wifiSignalStrength !== 0 && (
            <span className="text-xs text-primary-200">
              ({wifiSignalStrength} dBm)
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg opacity-50">
          <FiWifi className="w-4 h-4" />
          <span className="text-sm font-medium">No WiFi</span>
        </div>
      )}
    </div>
  );
};

export default DeviceStatusIndicators;

