import React, { useEffect, useState } from "react";
import AssignmentCards from "./AssignmentCards";

import useGetAssignments from "../hooks/useGetAssignments";

const AssignmentSection = () => {
  const { getAssignments, assignments } = useGetAssignments();

  useEffect(() => {
    getAssignments()
  }, [])

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      {assignments.length === 0 && "No Assignment founds"}
      {assignments?.map((assignment, index) => (
        <AssignmentCards
          key={assignment.id}
          id={assignment.id}
          title={assignment.title}
          subject={assignment.subject}
          createdBy={assignment.created_by_email}
          points={assignment.points}
          link={assignment.link}
        />
      ))}
    </div>
  );
};

export default AssignmentSection;
