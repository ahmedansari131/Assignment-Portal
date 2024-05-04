import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const AssignmentDocument = () => {
  const { assignmentId } = useParams();
  const userId = localStorage.getItem("user");
  const [fileUrl, setFileUrl] = useState(null);

  const serveDocumentHandler = async () => {
    try {
      const url = process.env.PORTAL_SERVER_URL;
      const response = await axios.get(
        `${url}/serve-documents/?user_id=${userId}&assignment_id=${assignmentId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );

      if (response.status === 200) {
        // const fileUrl = window.URL.createObjectURL(
        //   new Blob([response.data], { type: "application/pdf" })
        // );
        // setFileUrl(response.data);
      }
    } catch (error) {
      toast("Error occurred while serving the document");
      return;
    }
  };

  useEffect(() => {
    serveDocumentHandler();
  }, []);

  return (
    <div className="px-36">
      <div className="w-full py-3 flex justify-start items-center select-none"></div>
      <iframe
        title="PDF Viewer"
        src={fileUrl}
        style={{ width: "100%", height: "700px", border: "none" }}
      />
    </div>
  );
};

export default AssignmentDocument;
