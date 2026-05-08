import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const Loading = ({ text = "Loading" }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center text-primary min-h-[90vh] space-x-2">
      {text && <div className="text-lg font-medium text-gray-700">{text}</div>}
      <Bouncy size="26" speed="1.75" color="#ff4778" />
    </div>
  );
};

export default Loading;
