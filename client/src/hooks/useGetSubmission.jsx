import React, { useState } from "react";
import { ALL_SUBMISSIONS } from "../../constants";
import axios from "axios";

const useGetSubmission = () => {
  const [data, setData] = useState([]);

  const getSubmissions = async (assignmentId) => {
    const url = process.env.PORTAL_SERVER_URL;
    const response = await axios.get(`${url}/submissions/?assignment_id=${assignmentId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    });

    if (response.data.message.toLowerCase() === ALL_SUBMISSIONS.toLowerCase()) {
      setData(response.data.data);
    }
  };

  return { getSubmissions, data };
};

export default useGetSubmission;
