import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { FiThermometer, FiActivity, FiHeart } from "react-icons/fi";

interface HealthMetricsChartProps {
  data?: {
    temperature?: number[];
    spo2?: number[];
    heartRate?: number[];
    timestamps?: string[];
  };
}

const HealthMetricsChart = ({ data }: HealthMetricsChartProps) => {
  const [isClient, setIsClient] = useState(false);
  const [activeMetric, setActiveMetric] = useState<"temperature" | "spo2" | "heartRate">("temperature");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="text-gray-500">Loading chart...</div>;
  }

  // Generate sample data if no data provided
  const generateSampleData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (23 - i));
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    });

    return {
      temperature: Array.from({ length: 24 }, () => 36.5 + Math.random() * 1.5),
      spo2: Array.from({ length: 24 }, () => 95 + Math.random() * 5),
      heartRate: Array.from({ length: 24 }, () => 70 + Math.random() * 30),
      timestamps: hours,
    };
  };

  const chartData = data || generateSampleData();

  const getSeriesData = () => {
    switch (activeMetric) {
      case "temperature":
        return [
          {
            name: "Temperature (°C)",
            data: chartData.temperature || [],
          },
        ];
      case "spo2":
        return [
          {
            name: "SpO2 (%)",
            data: chartData.spo2 || [],
          },
        ];
      case "heartRate":
        return [
          {
            name: "Heart Rate (BPM)",
            data: chartData.heartRate || [],
          },
        ];
      default:
        return [];
    }
  };

  const getColor = () => {
    switch (activeMetric) {
      case "temperature":
        return "#ef4444"; // red
      case "spo2":
        return "#3b82f6"; // blue
      case "heartRate":
        return "#ec4899"; // pink
      default:
        return "#ff4778";
    }
  };

  const getLabel = () => {
    switch (activeMetric) {
      case "temperature":
        return "Temperature";
      case "spo2":
        return "SpO2";
      case "heartRate":
        return "Heart Rate";
      default:
        return "";
    }
  };

  const getIcon = () => {
    switch (activeMetric) {
      case "temperature":
        return <FiThermometer className="w-4 h-4" />;
      case "spo2":
        return <FiActivity className="w-4 h-4" />;
      case "heartRate":
        return <FiHeart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
        type: "x",
      },
    },
    colors: [getColor()],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: getColor(),
            opacity: 0.7,
          },
          {
            offset: 100,
            color: getColor(),
            opacity: 0.1,
          },
        ],
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: chartData.timestamps || [],
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
        rotate: -45,
        rotateAlways: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
        formatter: (value: number) => {
          if (activeMetric === "temperature") {
            return `${value.toFixed(1)}°C`;
          }
          if (activeMetric === "spo2") {
            return `${value.toFixed(0)}%`;
          }
          return `${value.toFixed(0)} BPM`;
        },
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value: number) => {
          if (activeMetric === "temperature") {
            return `${value.toFixed(1)}°C`;
          }
          if (activeMetric === "spo2") {
            return `${value.toFixed(0)}%`;
          }
          return `${value.toFixed(0)} BPM`;
        },
      },
    },
    markers: {
      size: 4,
      colors: [getColor()],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Health Metrics Trend
          </h3>
          <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMetric("temperature")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeMetric === "temperature"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FiThermometer className="w-4 h-4" />
            Temp
          </button>
          <button
            onClick={() => setActiveMetric("spo2")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeMetric === "spo2"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FiActivity className="w-4 h-4" />
            SpO2
          </button>
          <button
            onClick={() => setActiveMetric("heartRate")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeMetric === "heartRate"
                ? "bg-pink-100 text-pink-700 border border-pink-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FiHeart className="w-4 h-4" />
            HR
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        {getIcon()}
        <span className="text-sm font-medium text-gray-700">{getLabel()} Over Time</span>
      </div>
      <Chart
        options={options}
        series={getSeriesData()}
        type="area"
        height={350}
      />
    </div>
  );
};

export default HealthMetricsChart;

