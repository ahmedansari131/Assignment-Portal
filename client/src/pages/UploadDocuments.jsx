import React, { useState } from "react";
import { Button } from "../components";
import { useParams } from "react-router-dom";
import axios from "axios";

const UploadDocuments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const { assignmentId } = useParams();
  const userId = localStorage.getItem("user");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const url = process.env.PORTAL_SERVER_URL;
      const response = await axios.post(
        `${url}/upload/?user_id=${userId}&assignment_id=${assignmentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );
      if (response.status === 200) {
        setIsUploaded(true);
      }
    } catch (error) {
      console.log("Error occurred while uploadig documents -> ", error);
    }
  };

  return (
    <div className="min-h-[91.5vh] w-full flex justify-center items-center">
      {isUploaded ? (
        "Assignment successfully uploaded."
      ) : (
        <div>
          <div className="w-full">
            <div className="flex flex-col items-center justify-center w-full px-16 py-5 border border-gray-600 rounded-md">
              <div className="mt-10 mb-10 text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Upload your Assignments
                </h2>
                <p className="text-xs text-gray-500">
                  File should be of format .pdf
                </p>
              </div>
              <form
                action="#"
                className="relative px-5 py-10 max-w-xs mb-10 backdrop-blur-lg text-white ring-1 ring-inset bg-gray-700/40 ring-white/10 focus:ring-2 focus:ring-inset focus:outline-none rounded-lg shadow-inner hover:bg-gray-700/80"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  for="file-upload"
                  className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
                >
                  <p className="z-10 text-xs font-normal text-center text-gray-500">
                    Drag & Drop your files here
                  </p>
                  <svg
                    className="z-10 w-8 h-8 text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                  </svg>
                </label>
              </form>
              <Button text={"Upload"} func={handleUpload} />
            </div>
          </div>
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

export default UploadDocuments;
