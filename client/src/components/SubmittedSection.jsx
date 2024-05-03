import axios from "axios";
import React, { useEffect, useState } from "react";
import AssignmentCards from "./AssignmentCards";
import toast from "react-hot-toast";
import { Loader } from "../components";

const SubmittedSection = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSubmittedAssignments = async () => {
    setIsLoading(true);
    try {
      const user_id = localStorage.getItem("user");
      const url = process.env.PORTAL_SERVER_URL;
      const response = await axios.get(
        `${url}/individual-submissions/?user_id=${user_id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );

      if (response.status === 200) {
        setIsLoading(false)
        setAssignments(response.data.data);
      }
    } catch (error) {
      setIsLoading(false);
      toast("Error occurred while getting the submissions");
      console.log("Error occurred while getting the submissions -> ", error);
      return;
    }
  };
  useEffect(() => {
    getSubmittedAssignments();
  }, []);

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : !assignments?.length ? (
        <p>No submissions founds</p>
      ) : (
        assignments?.map((assignment, index) => (
          <AssignmentCards
            key={assignment.id}
            id={assignment.id}
            title={assignment.title}
            subject={assignment.subject}
            createdBy={assignment.created_by_email}
            points={assignment.points}
            link={assignment.link}
            submittedLink={assignment.submitted_link || null}
          />
        ))
      )}
    </div>
  );
};

export default SubmittedSection;
