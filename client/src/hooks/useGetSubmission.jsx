import React, { useState } from "react";
import { ALL_SUBMISSIONS } from "../../constants";
import axios from "axios";

const useGetSubmission = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSubmissions = async (assignmentId) => {
    setIsLoading(true);
    try {
      const url = process.env.PORTAL_SERVER_URL;
      const response = await axios.get(
        `${url}/submissions/?assignment_id=${assignmentId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );

      if (response.status === 200) {
        setData(response.data.data);
        setIsLoading(false)
      }
    } catch (error) {}
  };

  return { getSubmissions, data, isLoading };
};

export default useGetSubmission;
