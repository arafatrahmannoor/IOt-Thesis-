import { FiCheckCircle, FiFileText } from "react-icons/fi";

interface CompletionMessageProps {
  isAutoEnded: boolean;
}

const CompletionMessage = ({ isAutoEnded }: CompletionMessageProps) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-green-900 mb-1">
            {isAutoEnded ? "Monitoring Completed!" : "Monitoring Paused"}
          </h3>
          <p className="text-sm text-green-700 mb-3">
            {isAutoEnded
              ? "Your monitoring session has completed successfully. You can now generate reports based on the collected data."
              : "Monitoring has been paused. You can resume or generate reports with the current data."}
          </p>
          <div className="flex items-center gap-2 text-sm text-green-800">
            <FiFileText className="w-4 h-4" />
            <span className="font-medium">Ready for Reports</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionMessage;

