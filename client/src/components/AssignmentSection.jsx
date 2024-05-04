import React, { useEffect, useState } from "react";
import AssignmentCards from "./AssignmentCards";
import { Loader } from "../components";
import useGetAssignments from "../hooks/useGetAssignments";

const AssignmentSection = () => {
  const { getAssignments, assignments, isLoading } = useGetAssignments();

  // useEffect(() => {
  //   getAssignments();
  // }, []);

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : !assignments?.length ? (
        <p>No assignments founds</p>
      ) : (
        assignments?.map((assignment) => (
          <AssignmentCards
            key={assignment.id}
            id={assignment.id}
            title={assignment.title}
            subject={assignment.subject}
            createdBy={assignment.created_by_email}
            points={assignment.points}
            link={assignment.link}
          />
        ))
      )}

      {}
    </div>
  );
};

export default AssignmentSection;
