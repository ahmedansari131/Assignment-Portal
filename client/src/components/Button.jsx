import React from "react";
import { cn } from "../utils";
import { Loader } from "../components";

const Button = (props) => {
  const { text, className, func, isLoading = false, children } = props;
  return (
    <button
      onClick={func}
      className={cn(
        "flex-none rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 flex items-center gap-3 justify-center",
        className
      )}
    >
      {isLoading && <Loader />}
      {children}
    </button>
  );
};

export default Button;
