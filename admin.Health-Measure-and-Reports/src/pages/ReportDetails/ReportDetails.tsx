import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { FiFileText, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface ReportData {
  prediction: string;
  probability: number;
  input_data: {
    Temp_C: number;
    SpO2: number;
    BPM: number;
  };
}

interface ReportMetadata {
  model?: string;
  dataPoints?: number;
  validDataPoints?: number;
  duration?: number;
  timestamp?: Date;
}

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state or use dummy data
  const [reportData, setReportData] = useState<ReportData>({
    prediction: "Normal",
    probability: 0.1234,
    input_data: {
      Temp_C: 37.0,
      SpO2: 99,
      BPM: 70,
    },
  });

  const [metadata, setMetadata] = useState<ReportMetadata>({});

  useEffect(() => {
    // If ML API report data passed from dashboard, use it directly
    if (location.state?.reportData) {
      const mlApiData = location.state.reportData;
      // ML API Report Data received successfully
      
      setReportData({
        prediction: mlApiData.prediction || "Normal",
        probability: mlApiData.probability || 0.5,
        input_data: mlApiData.input_data || {
          Temp_C: mlApiData.averages?.Temp_C || 37.0,
          SpO2: mlApiData.averages?.SpO2 || 99,
          BPM: mlApiData.averages?.BPM || 70,
        },
      });

      // Set metadata
      setMetadata({
        model: location.state.model || "model-with-own-data-set",
        dataPoints: mlApiData.dataPoints || location.state.dataPoints,
        validDataPoints: mlApiData.validDataPoints || location.state.validDataPoints,
        duration: location.state.duration,
        timestamp: new Date(),
      });
    } else if (location.state?.rawData && location.state?.rawData.length > 0) {
      // Fallback: Calculate from raw data if ML API data not available
      const data = location.state.rawData;
      const avgTemp = data.reduce((sum: number, d: { temperatureC?: number }) => sum + (d.temperatureC || 0), 0) / data.length;
      const avgSpO2 = data.reduce((sum: number, d: { spo2?: number }) => sum + (d.spo2 || 0), 0) / data.length;
      const avgBPM = data.reduce((sum: number, d: { heartRate?: number }) => sum + (d.heartRate || 0), 0) / data.length;
      
      setReportData({
        prediction: location.state.prediction || "Normal",
        probability: location.state.probability || 0.5,
        input_data: {
          Temp_C: Number(avgTemp.toFixed(1)),
          SpO2: Math.round(avgSpO2),
          BPM: Math.round(avgBPM),
        },
      });

      setMetadata({
        model: location.state.model,
        dataPoints: data.length,
        duration: location.state.duration,
        timestamp: new Date(),
      });
    }
  }, [location.state]);

  const getPredictionColor = (prediction: string) => {
    switch (prediction.toLowerCase()) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "abnormal":
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getPredictionIcon = (prediction: string) => {
    const isNormal = prediction.toLowerCase() === "normal";
    return isNormal ? (
      <FiCheckCircle className="w-6 h-6" />
    ) : (
      <FiAlertCircle className="w-6 h-6" />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Health Report Details"
        subtitle="AI-powered health prediction report"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Reports", path: "/reports" },
          { title: "Report Details" },
        ]}
      />

      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            // Navigate back to dashboard if came from dashboard, otherwise go to reports
            if (location.state?.fromDashboard) {
              navigate("/");
            } else {
              navigate("/reports");
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>{location.state?.fromDashboard ? "Back to Dashboard" : "Back to Reports"}</span>
        </button>
      </div>

      {/* Report Card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">ML Prediction Report</h2>
            <p className="text-sm text-gray-500">
              Report ID: {id || "new"} 
              {metadata.model && ` • Model: ${metadata.model}`}
              {metadata.dataPoints && ` • Data Points: ${metadata.dataPoints}`}
            </p>
          </div>
        </div>

        {/* Report Metadata */}
        {metadata && (metadata.duration || metadata.validDataPoints) && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {metadata.duration && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 font-medium mb-1">Monitoring Duration</p>
                <p className="text-lg font-bold text-blue-900">{metadata.duration} minutes</p>
              </div>
            )}
            {metadata.dataPoints && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-600 font-medium mb-1">Total Data Points</p>
                <p className="text-lg font-bold text-purple-900">{metadata.dataPoints}</p>
              </div>
            )}
            {metadata.validDataPoints && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-600 font-medium mb-1">Valid Data Points</p>
                <p className="text-lg font-bold text-green-900">{metadata.validDataPoints}</p>
              </div>
            )}
          </div>
        )}

        {/* Prediction Result */}
        <div className="mb-6">
          <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 ${getPredictionColor(reportData.prediction)}`}>
            {getPredictionIcon(reportData.prediction)}
            <div>
              <p className="text-sm font-medium mb-1">Prediction</p>
              <p className="text-2xl font-bold">{reportData.prediction}</p>
            </div>
            <div className="ml-4 pl-4 border-l-2 border-current opacity-50">
              <p className="text-sm font-medium mb-1">Confidence</p>
              <p className="text-xl font-bold">
                {(reportData.probability * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Input Data */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-500 mb-2">Temperature</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.input_data.Temp_C}°C
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-500 mb-2">SpO2</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.input_data.SpO2}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-500 mb-2">Heart Rate (BPM)</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.input_data.BPM}
              </p>
            </div>
          </div>
        </div>

        {/* Raw JSON Data */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Raw Data</h3>
          <pre className="text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ReportDetails;
