import React, { useEffect, useState } from "react";
import { Button, Input, Loader } from "../components";
import useGetSubmission from "../hooks/useGetSubmission";
import { useParams } from "react-router-dom";
import pdfIcon from "../assests/pdf.png";
import axios from "axios";
import AnalysisTable from "../pages/AnalysisTable";

const Table = () => {
  const { getSubmissions, data } = useGetSubmission();
  const { assignmentId } = useParams();
  const [fileUrl, setFileUrl] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          responseType: "blob", // Set the response type to 'blob'
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

  const backHandler = () => {
    if (fileUrl) setFileUrl("");

    if (analysisData) setAnalysisData(null);

    if (isLoading) setIsLoading(false);
  };

  useEffect(() => {
    getSubmissions(assignmentId);
  }, []);

  const plagiarismHandler = async () => {
    setIsLoading(true);
    try {
      const url = process.env.PORTAL_SERVER_URL;
      const data = { assignment_id: assignmentId };
      const response = await axios.post(`${url}/plagiarism/`, data);

      if (response.status === 200) {
        setAnalysisData(response.data.data);
      }
    } catch (error) {
      console.log("Error occurred while detecting the plagiarism -> ", error);
    }
  };

  return (
    <div className="px-36">
      {fileUrl ? (
        <>
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
        </>
      ) : analysisData ? (
        <div className="flex justify-start mt-5 flex-col">
          <div className="flex items-center gap-5">
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
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                {data[0]?.assignments[0].title}
              </h2>
            </div>
          </div>
          <AnalysisTable data={analysisData} />
        </div>
      ) : isLoading ? (
        <div className="min-h-[91.5vh] flex justify-center items-center font-medium text-xl gap-5">
          <Loader /> Loading
        </div>
      ) : (
        <section className="container px-4 mx-auto">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-x-3 mt-6">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  {data[0]?.assignments[0].title}
                </h2>

                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                  {data.length >= 1
                    ? data.length + " Submission"
                    : data.length + " Submissions"}
                </span>
              </div>
            </div>

            <div className="flex items-center mt-4 gap-x-3">
              <Button text={"Check Plagiarism"} func={plagiarismHandler} />
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <div className="-mx-8">
              <div className="inline-block w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 w-full">
                      <tr className=" justify-between w-full items-center">
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-3 focus:outline-none">
                            <span>Students</span>
                          </button>
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Submitted Documents
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-500/20 bg-gray-800/30">
                      {data?.map((submission, index) => (
                        <tr className="" key={index}>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                            <div>
                              <h2 className="text-gray-800 dark:text-white ">
                                {submission.email
                                  .split(".")[0][0]
                                  .toUpperCase() +
                                  submission.email.split(".")[0].substring(1) +
                                  " " +
                                  submission.email
                                    .split(".")[1][0]
                                    .toUpperCase() +
                                  submission.email
                                    .split(".")[1]
                                    .substring(1)
                                    .replace("@vit", "")}
                              </h2>
                            </div>
                          </td>
                          <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                            <a
                              className="cursor-pointer "
                              href={submission.document}
                              target="_blank"
                              onClick={serveDocumentHandler}
                            >
                              <img
                                className="pointer-events-none"
                                src={pdfIcon}
                                width={25}
                              />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Table;
