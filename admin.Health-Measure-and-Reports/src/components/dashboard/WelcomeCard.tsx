import DeviceStatusIndicators from "./DeviceStatusIndicators";
import MonitoringControls from "./MonitoringControls";

interface DeviceStatus {
  isOnline: boolean;
  hasInternet: boolean;
  wifiNetworkName?: string;
  wifiSignalStrength?: number;
  isInitialized?: boolean;
}

interface WelcomeCardProps {
  deviceStatus: DeviceStatus;
  selectedTime: number | "custom";
  customTime: number;
  isMonitoring: boolean;
  isPaused: boolean;
  timeRemaining: number;
  canStartMonitoring: boolean;
  onTimeChange: (value: number | "custom") => void;
  onCustomTimeChange: (value: number) => void;
  onStart: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop: () => void;
  formatTime: (seconds: number) => string;
}

const WelcomeCard = ({
  deviceStatus,
  selectedTime,
  customTime,
  isMonitoring,
  isPaused,
  timeRemaining,
  canStartMonitoring,
  onTimeChange,
  onCustomTimeChange,
  onStart,
  onPause,
  onResume,
  onStop,
  formatTime,
}: WelcomeCardProps) => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl border p-6 text-white">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome to Airduino Health Monitor
          </h1>
          <p className="text-primary-100 text-sm md:text-base mb-4">
            Real-time health data monitoring from ESP32 devices
          </p>

          <DeviceStatusIndicators
            isOnline={deviceStatus.isOnline}
            hasInternet={deviceStatus.hasInternet}
            wifiNetworkName={deviceStatus.wifiNetworkName}
            wifiSignalStrength={deviceStatus.wifiSignalStrength}
            isInitialized={deviceStatus.isInitialized}
          />
        </div>

        <MonitoringControls
          selectedTime={selectedTime}
          customTime={customTime}
          isMonitoring={isMonitoring}
          isPaused={isPaused}
          timeRemaining={timeRemaining}
          canStartMonitoring={canStartMonitoring}
          onTimeChange={onTimeChange}
          onCustomTimeChange={onCustomTimeChange}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onStop={onStop}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
};

export default WelcomeCard;

