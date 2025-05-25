import React from "react";

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const getColor = () => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="relative w-full group">
      {/* Tooltip - One line, 12px, no wrapping */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="bg-[#8b2eff] text-white text-[12px] font-medium px-4 py-1 rounded-full shadow whitespace-nowrap relative">
          {progress}% completed
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#8b2eff] rotate-45 z-[-1]"></div>
        </div>
      </div>

      {/* Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
        <div
          className={`h-3 rounded-full ${getColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;