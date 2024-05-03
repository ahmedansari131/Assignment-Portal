import React, { useState } from "react";
import Button from "./Button";
import { useSelector } from "react-redux";
import { Dialogue } from "../components";

const SubNav = ({ onSelect, selectedItem }) => {
  const role = useSelector((state) => state.isLoggedIn.role);
  const [open, setOpen] = useState(false);

  const openDialogue = () => {
    setOpen(true);
  };

  return (
    <div className="">
      <nav className="flex justify- items-center border-b border-gray-800 py-6 px-40 text-gray-300 font-normal">
        <ul className="flex items-center gap-8">
          {role === "teacher" && (
            <li
              className={`cursor-pointer hover:text-indigo-400 text-lg font-medium`}
            >
              {/* Assignments */}
            </li>
          )}
          {role === "student" && (
            <li
              className={`cursor-pointer hover:text-indigo-40`}

            >
              Submissions
            </li>
          )}
          {/* {role === "student" && (
            <li
              className={`cursor-pointer hover:text-indigo-400 ${
                selectedItem === "pastDue" ? "text-indigo-400" : ""
              }`}
              onClick={() => onSelect("pastDue")}
            >
              Past Due
            </li>
          )} */}
        </ul>

        {role === "teacher" && (
          <div>
            <Button className={"font-medium flex"} func={openDialogue}>
              <svg
                width="19"
                height="19"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              Create Assignment
            </Button>
          </div>
        )}
        <Dialogue open={open} setOpen={setOpen} />
      </nav>
    </div>
  );
};

export default SubNav;
