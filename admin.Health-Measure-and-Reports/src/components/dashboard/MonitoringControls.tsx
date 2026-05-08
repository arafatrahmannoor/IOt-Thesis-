import { FiPlay, FiSquare, FiPause } from "react-icons/fi";
import { Select } from "antd";

interface MonitoringControlsProps {
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

const MonitoringControls = ({
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
}: MonitoringControlsProps) => {
  return (
    <div className="flex flex-col gap-3 w-full lg:w-[200px]">
      {/* Time Selection Dropdown */}
      {selectedTime === "custom" ? (
        <div className="flex items-center gap-2">
          <Select
            value={selectedTime}
            onChange={(value) => {
              onTimeChange(value);
              if (value !== "custom") {
                onCustomTimeChange(10);
              }
            }}
            className="flex-1"
            disabled={isMonitoring}
            size="large"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <Select.Option value={2}>2 minutes</Select.Option>
            <Select.Option value={5}>5 minutes</Select.Option>
            <Select.Option value={10}>10 minutes</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          <input
            type="number"
            min="1"
            max="60"
            value={customTime}
            onChange={(e) => onCustomTimeChange(Number(e.target.value))}
            className="w-20 px-3 py-2.5 rounded-lg bg-white/90 border border-white/30 text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Min"
            disabled={isMonitoring}
          />
        </div>
      ) : (
        <Select
          value={selectedTime}
          onChange={(value) => {
            onTimeChange(value);
            if (value !== "custom") {
              onCustomTimeChange(10);
            }
          }}
          className="w-full"
          disabled={isMonitoring}
          size="large"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Select.Option value={2}>2 minutes</Select.Option>
          <Select.Option value={5}>5 minutes</Select.Option>
          <Select.Option value={10}>10 minutes</Select.Option>
          <Select.Option value="custom">Custom</Select.Option>
        </Select>
      )}

      {/* Start/Pause/Resume/Stop Button */}
      {isPaused ? (
        <button
          onClick={onResume}
          className="w-full px-6 py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2"
        >
          <FiPlay className="w-5 h-5" />
          Resume ({formatTime(timeRemaining)})
        </button>
      ) : !isMonitoring ? (
        <button
          onClick={onStart}
          disabled={!canStartMonitoring}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            canStartMonitoring
              ? "bg-white text-primary-600 hover:bg-primary-50 hover:shadow-lg transform hover:-translate-y-0.5"
              : "bg-gray-300/50 text-gray-200 cursor-not-allowed"
          }`}
          title={
            canStartMonitoring
              ? "Start Monitoring"
              : "Device must be online and connected to internet"
          }
        >
          <FiPlay className="w-5 h-5" />
          Start Monitoring
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onPause}
            className="flex-1 px-4 py-3 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
          >
            <FiPause className="w-4 h-4" />
            Pause
          </button>
          <button
            onClick={onStop}
            className="flex-1 px-4 py-3 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center gap-2"
          >
            <FiSquare className="w-4 h-4" />
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default MonitoringControls;

