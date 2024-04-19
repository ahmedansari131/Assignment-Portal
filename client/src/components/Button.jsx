import React from "react";
import { cn } from "../utils";

const Button = (props) => {
  const { text, className, func } = props;
  return (
    <button
      onClick={func}
      className={cn(
        "bg-sky-900 px-4 py-2 rounded-md cursor-pointer hover:bg-sky-700 transition-all duration-200",
        className
      )}
    >
      {text}
    </button>
  );
};

export default Button;
