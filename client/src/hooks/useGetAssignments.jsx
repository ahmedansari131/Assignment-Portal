import React, { useEffect, useState } from "react";
import axios from "axios";
import { GOT_ASSIGNMENT } from "../../constants";

const useGetAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  const getAssignments = async () => {
    try {
      const url = process.env.PORTAL_SERVER_URL;
      const response = await axios.get(
        `${url}/assignments/?user_id=${localStorage.getItem("user")}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );

      if (
        response.data.message.toLowerCase() === GOT_ASSIGNMENT.toLowerCase()
      ) {
        setAssignments(response.data.data);
      }
    } catch (error) {
      console.log("Error occurred while getting the assignments -> ", error);
    }
  };

  useEffect(() => {
    console.log(assignments);
  }, [assignments]);
  
  return { assignments, getAssignments };
};

export default useGetAssignments;
