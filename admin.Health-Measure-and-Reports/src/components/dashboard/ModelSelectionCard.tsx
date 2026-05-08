import { Select } from "antd";
import { FiPlay } from "react-icons/fi";

interface ModelSelectionCardProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  onGetReport: () => void;
  onResume?: () => void;
  isLoading?: boolean;
}

const ModelSelectionCard = ({
  selectedModel,
  onModelChange,
  onGetReport,
  onResume,
  isLoading = false,
}: ModelSelectionCardProps) => {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Machine Learning Model
      </h3>
      <div className="flex items-center gap-4">
        <Select
          value={selectedModel}
          onChange={onModelChange}
          placeholder="Select a model"
          className="flex-1"
          size="large"
        >
          <Select.Option value="model-with-own-data-set">Model with Own Data Set</Select.Option>
        </Select>
        {onResume && (
          <button
            onClick={onResume}
            className="px-6 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <FiPlay className="w-4 h-4" />
            Resume Monitoring
          </button>
        )}
        <button
          onClick={onGetReport}
          disabled={!selectedModel || isLoading}
          className="px-6 py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Get Reports"}
        </button>
      </div>
    </div>
  );
};

export default ModelSelectionCard;

