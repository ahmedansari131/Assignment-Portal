import React from "react";
import { cn } from "../utils";

const Input = (props, ref) => {
  const { type = "text", placeholder = "", className } = props;
  return (
    <input
    {...props}
    ref={ref}
      type={type}
      className={cn(
        "min-w-0 w-full flex-auto outline-none rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6", className
      )}
      placeholder={placeholder}
    />
  );
};

export default React.forwardRef(Input);
