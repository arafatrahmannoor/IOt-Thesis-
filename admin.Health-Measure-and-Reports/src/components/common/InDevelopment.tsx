import { ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface InDevelopmentProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

const InDevelopment = ({ 
  title = "In Development", 
  description = "This feature is currently under development and will be available soon.",
  icon
}: InDevelopmentProps) => {
  return (
    <div className="bg-white rounded-xl border p-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
          {icon || <FiAlertCircle className="w-10 h-10 text-yellow-600" />}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
};

export default InDevelopment;

