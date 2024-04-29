import React, { useState } from "react";
import {
  AssignmentSection,
  PastDueSection,
  SubNav,
  SubmittedSection,
} from "../components";
import { useSelector } from "react-redux";

const Assignments = () => {
  const role = useSelector(state => state.isLoggedIn.role);
  const [selectedItem, setSelectedItem] = useState(`${role === "student" ? "submitted" : "assignments"}`);

  const renderComponent = () => {
    switch (selectedItem) {
      case "assignments":
        return <AssignmentSection />;
      case "submitted":
        return <SubmittedSection />;
      case "pastDue":
        return <PastDueSection />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full min-h-screen">
        <SubNav onSelect={(item) => setSelectedItem(item)} selectedItem={selectedItem} />
        <div className="px-36 py-5">{renderComponent()}</div>t
      </div>
    </>
  );
};

export default Assignments;
