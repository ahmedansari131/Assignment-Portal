import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-3 border-gray-200"></div>
    </div>
  );
};

export default Loader;