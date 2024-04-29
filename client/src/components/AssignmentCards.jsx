import React, { useState } from "react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useSelector } from "react-redux";

const AssignmentCards = (props) => {
  const { title, subject, createdBy, points, id, link } = props;
  const [isCopied, setIsCopied] = useState(false);
  const role = useSelector((state) => state.isLoggedIn.role);

  const copyLinkHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.navigator.clipboard.writeText(link);
    setIsCopied(true);
  };

  const shareLinkHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = "Assignment Link";
    const url = link;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
      text
    )}%0A${encodeURIComponent(url)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <>
      <Link className="w-full" to={`/assignments/${id}/`}>
        <div className="bg-indigo-800 w-full px-5 py-4 cursor-pointer bg-opacity-50 border border-indigo-700 rounded-md text-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h3 className="text-[1rem] font-medium">{title}</h3>
            </div>

            {role === "teacher" && (
              <div className="flex gap-3">
                <span
                  className="text-sm cursor-pointer bg-indigo-950  px-2 py-2 rounded-sm hover:bg-indigo-900 flex justify-center items-center"
                  onClick={copyLinkHandler}
                >
                  {!isCopied ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    "Copied"
                  )}
                </span>
                <span
                  className="text-sm cursor-pointer bg-indigo-950  px-2 py-2 rounded-sm hover:bg-indigo-900 flex justify-center items-center"
                  onClick={shareLinkHandler}
                >
                  <WhatsAppIcon style={{ fontSize: "1rem" }} />
                </span>
              </div>
            )}
          </div>
          <span className="text-gray-400 text-sm">{subject}</span>
        </div>
      </Link>
    </>
  );
};

export default AssignmentCards;
