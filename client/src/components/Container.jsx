import React from "react";
import { cn } from "../utils";

const Container = ({ children }) => {
  return (
    <>
      <div
        className={cn(
          "bg-gray-900 text-gray-200 w-full h-full relative isolate overflow-hidden"
        )}
      >
        {children}
      </div>
      
    </>
  );
};

export default Container;
