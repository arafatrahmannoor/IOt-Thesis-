import { 
  FiMonitor, 
  FiThermometer, 
  FiActivity, 
  FiHeart, 
  FiWifi,
  FiClock 
} from "react-icons/fi";
import HealthMonitorWidget from "../healthMonitor/HealthMonitorWidget";

interface HealthMonitorContainerProps {
  isMonitoring: boolean;
  showSkeleton: boolean;
  timeRemaining: number;
  onDataReceived: (data: any) => void;
  formatTime: (seconds: number) => string;
  hasStartedMonitoring: boolean; // Track if monitoring has started at least once
}

const HealthMonitorContainer = ({
  isMonitoring,
  showSkeleton,
  timeRemaining,
  onDataReceived,
  formatTime,
  hasStartedMonitoring,
}: HealthMonitorContainerProps) => {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Health Monitor</h3>
        {isMonitoring && (
          <div className="flex items-center gap-2 text-sm">
            <FiClock className="w-4 h-4 text-primary-600" />
            <span className="font-mono font-semibold text-primary-600">
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
        {!isMonitoring && hasStartedMonitoring && (
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
              Paused
            </span>
          </div>
        )}
      </div>

      {!hasStartedMonitoring && !showSkeleton ? (
        <PlaceholderView />
      ) : showSkeleton ? (
        <SkeletonView />
      ) : (
        <HealthMonitorWidget 
          isActive={isMonitoring} 
          onDataReceived={onDataReceived}
        />
      )}
    </div>
  );
};

const PlaceholderView = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-4">
        <FiMonitor className="w-10 h-10 text-primary-600" />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        Ready to Start Monitoring
      </h4>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
        Select monitoring duration and click "Start Monitoring" to begin real-time
        health data collection
      </p>
      <div className="flex items-center justify-center gap-6 mt-6">
        <MetricIcon 
          icon={<FiThermometer className="w-6 h-6 text-blue-600" />}
          label="Temperature"
          bgColor="bg-blue-50"
        />
        <MetricIcon 
          icon={<FiActivity className="w-6 h-6 text-green-600" />}
          label="SpO2"
          bgColor="bg-green-50"
        />
        <MetricIcon 
          icon={<FiHeart className="w-6 h-6 text-pink-600" />}
          label="Heart Rate"
          bgColor="bg-pink-50"
        />
        <MetricIcon 
          icon={<FiWifi className="w-6 h-6 text-purple-600" />}
          label="WiFi Signal"
          bgColor="bg-purple-50"
        />
      </div>
    </div>
  );
};

interface MetricIconProps {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
}

const MetricIcon = ({ icon, label, bgColor }: MetricIconProps) => {
  return (
    <div className="text-center">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
};

const SkeletonView = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

export default HealthMonitorContainer;

