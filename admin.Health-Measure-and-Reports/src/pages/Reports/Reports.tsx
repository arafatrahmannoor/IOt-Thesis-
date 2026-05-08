import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { FiFileText, FiDownload, FiActivity, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useGetReportsMutation } from "../../redux/features/dashboard/dashboardApi";

interface ReportData {
  prediction?: string;
  probability?: number;
  input_data?: {
    Temp_C: number;
    SpO2: number;
    BPM: number;
  };
  metadata?: {
    model?: string;
    dataPoints?: number;
    validDataPoints?: number;
    duration?: number;
    timestamp?: Date;
  };
}

function Reports() {
  const [getReports, { isLoading }] = useGetReportsMutation();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Sample health data for generating reports
  const sampleHealthData = [
    { temperatureC: 36.5, spo2: 98, heartRate: 75 },
    { temperatureC: 36.7, spo2: 97, heartRate: 78 },
    { temperatureC: 36.4, spo2: 99, heartRate: 72 },
    { temperatureC: 36.6, spo2: 96, heartRate: 80 },
    { temperatureC: 36.8, spo2: 98, heartRate: 76 }
  ];

  const handleGenerateReport = async () => {
    try {
      const result = await getReports({
        model: "health-prediction-model",
        data: sampleHealthData
      }).unwrap();

      setReportData(result.data);
      setNotification({type: 'success', message: 'Health report generated successfully!'});
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (error: unknown) {
      console.error("Error generating report:", error);
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error as { data?: { message?: string } }).data?.message || 'Failed to generate report'
        : 'Failed to generate report';
      setNotification({type: 'error', message: errorMessage});
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const getHealthStatus = (prediction: string, probability: number) => {
    if (prediction === "Normal" && probability > 0.7) {
      return { status: "Excellent", color: "text-green-600 bg-green-50", icon: "✓" };
    } else if (prediction === "Normal") {
      return { status: "Good", color: "text-blue-600 bg-blue-50", icon: "●" };
    } else {
      return { status: "Needs Attention", color: "text-yellow-600 bg-yellow-50", icon: "⚠" };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Health Reports"
        subtitle="AI-powered health analysis and prediction reports"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Reports" },
        ]}
      />

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? 
              <FiCheckCircle className="w-5 h-5" /> : 
              <FiAlertCircle className="w-5 h-5" />
            }
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* Generate Report Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiFileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Generate Health Report</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Generate an AI-powered health analysis report based on collected monitoring data.
        </p>

        <button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FiActivity className="w-5 h-5" />
          {isLoading ? "Generating Report..." : "Generate Health Report"}
        </button>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiFileText className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Health Analysis Report</h2>
            </div>
            <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <FiDownload className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          {/* Health Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className={`p-4 rounded-lg ${getHealthStatus(reportData.prediction, reportData.probability).color}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getHealthStatus(reportData.prediction, reportData.probability).icon}</span>
                <div>
                  <h3 className="font-semibold">Health Status</h3>
                  <p className="text-lg font-medium">{getHealthStatus(reportData.prediction, reportData.probability).status}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-gray-700">Prediction</h3>
                  <p className="text-lg font-medium text-gray-900">{reportData.prediction}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-gray-700">Confidence</h3>
                  <p className="text-lg font-medium text-gray-900">{(reportData.probability * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs Averages */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Vital Signs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-700">Temperature</h4>
                <p className="text-2xl font-bold text-red-600">{reportData.averages.Temp_C.toFixed(1)}°C</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700">SpO2</h4>
                <p className="text-2xl font-bold text-blue-600">{reportData.averages.SpO2.toFixed(1)}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-700">Heart Rate</h4>
                <p className="text-2xl font-bold text-green-600">{reportData.averages.BPM.toFixed(1)} BPM</p>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Model Used</p>
                <p className="text-gray-600">{reportData.model}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Data Points</p>
                <p className="text-gray-600">{reportData.dataPoints}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Valid Readings</p>
                <p className="text-gray-600">{reportData.validDataPoints}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Generated</p>
                <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;

