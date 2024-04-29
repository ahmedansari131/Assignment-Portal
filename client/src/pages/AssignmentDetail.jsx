import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { useSelector } from "react-redux";
import pdfImage from "../assests/pdf.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import useGetSubmission from "../hooks/useGetSubmission";

const AssignmentDetail = () => {
  const role = useSelector((state) => state.isLoggedIn.role);
  const [fileUrl, setFileUrl] = useState("");
  const { getSubmissions, data } = useGetSubmission();
  const { assignmentId } = useParams();

  const serveDocumentHandler = async (e) => {
    e.preventDefault();
    try {
      const data = { file_path: e.target.href };
      const url = process.env.PORTAL_SERVER_URL;
      const response = await axios.post(
        `${url}/serve-documents/`,
        data,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        },
        {
          responseType: "blob",
        }
      );
      const fileUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      setFileUrl(fileUrl);
    } catch (error) {
      console.log(
        "Error occurred while sending pdf path to the server -> ",
        error
      );
    }
  };

  useEffect(() => {
    if (role === "student") {
      getSubmissions(assignmentId);
    }
  }, []);

  const backHandler = () => {
    setFileUrl("");
  };

  return (
    <div className="min-h-[91.5vh]">
      {role === "teacher" ? (
        <Table />
      ) : fileUrl ? (
        <div className="px-36">
          <div className="w-full py-3 flex justify-start items-center select-none">
            <div
              className="bg-indigo-500 px-3 py-1 rounded-sm cursor-pointer hover:bg-indigo-400"
              onClick={backHandler}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
          <iframe
            title="PDF Viewer"
            src={fileUrl}
            style={{ width: "100%", height: "700px", border: "none" }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6 justify-start px-36 pt-12 ">
          {data?.map((submission, index) => (
            <a key={submission.assignments[0].id} href={submission.document} onClick={serveDocumentHandler}>
              <div className="flex cursor-pointer gap-6 bg-gray-700/50 border border-gray-600 hover:bg-gray-700/80 px-5 py-4 rounded-md pointer-events-none">
                <img src={pdfImage} alt="" width={30} />
                <h3 className="text-lg">{submission.assignments[0].title}</h3>
              </div>
            </a>
          ))}
        </div>
      )}

      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

export default AssignmentDetail;
