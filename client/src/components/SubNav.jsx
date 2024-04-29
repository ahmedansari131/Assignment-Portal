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
    <div className="mt-3">
      <nav className="flex justify-between items-center border-b border-gray-800 py-4 px-36 text-gray-300 font-normal">
        <ul className="flex items-center gap-8">
          {role === "teacher" && (
            <li
              className={`cursor-pointer hover:text-indigo-400 ${
                selectedItem === "assignments" ? "text-indigo-400" : ""
              }`}
              onClick={() => onSelect("assignments")}
            >
              Assignments
            </li>
          )}
          {role === "student" && <li
            className={`cursor-pointer hover:text-indigo-400 ${
              selectedItem === "submitted" ? "text-indigo-400" : ""
            }`}
            onClick={() => onSelect("submitted")}
          >
            Submissions
          </li>}
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
            <Button text={"Create Assignments"} func={openDialogue} />
          </div>
        )}
        <Dialogue open={open} setOpen={setOpen} />
      </nav>
    </div>
  );
};

export default SubNav;
