import React, { useEffect, useState } from "react";
import axios from "axios";
import { GOT_ASSIGNMENT } from "../../constants";
import toast from "react-hot-toast";

const useGetAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAssignments = async () => {
    setIsLoading(true);
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
        setIsLoading(false);
        setAssignments(response.data.data);
      }
    } catch (error) {
      setIsLoading(false);
      toast("Error occurred while getting the assignments");
      console.log("Error occurred while getting the assignments -> ", error);
      return;
    }
  };

  useEffect(() => {
    getAssignments()
  }, [])

  return { assignments, getAssignments, isLoading };
};

export default useGetAssignments;
