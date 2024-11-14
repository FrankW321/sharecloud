import React from "react";

export type NavigationProps = {
  onPrevQuarter: () => void;
  onNextQuarter: () => void;
};

const Navigation: React.FC<NavigationProps> = ({ onPrevQuarter, onNextQuarter }) => (
  <div className="flex justify-between mb-6">
    <button onClick={onPrevQuarter} className="w-1/12 mx-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none">
      {"< Previous"}
    </button>
    <button onClick={onNextQuarter} className="w-1/12 mx-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none">
      {"Next >"}
    </button>
  </div>
);

export default Navigation;
