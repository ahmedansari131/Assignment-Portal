import React from "react";
import { NormalPlagiarisedTable } from "../components";

const AnalysisTable = (props) => {
  const { data, assignmentName } = props;

  return (
    <>
      <section className="container mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="mt-7 text-lg">
            <h2>High Plagiarism Detected</h2>
          </div>
        </div>

        <div className="flex flex-col mt-1">
          <div className="-mx-8">
            <div className="inline-block w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800 w-full">
                    <tr className=" justify-between w-full items-center">
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Student 1
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Student 2
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Plagiarism Found (%)
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Document
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-500/20 bg-gray-800/30">
                    {data[0]?.map((item, index) => (
                      <tr key={item.plagiarism} className="">
                        <td className="px-4 py-4 text-sm font-medium ">
                          <div>
                            <h2 className="text-gray-800 dark:text-white flex items-center gap-4">
                              {item.authentic[0]
                                .split(".")[0][0]
                                .toUpperCase() +
                                item.authentic[0].split(".")[0].substring(1) +
                                " " +
                                item.authentic[0]
                                  .split(".")[1][0]
                                  .toUpperCase() +
                                item.authentic[0]
                                  .split(".")[1]
                                  .substring(1)
                                  .replace("@vit", "")}
                              <span className="px-3 py-1 text-xs text-green-500 bg-blue-100 rounded-full dark:bg-gray-800">
                                authentic
                              </span>
                            </h2>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">
                          <div>
                            <h2 className="text-gray-800 dark:text-white flex items-center gap-4">
                              {item.plagiarized[0]
                                .split(".")[0][0]
                                .toUpperCase() +
                                item.plagiarized[0].split(".")[0].substring(1) +
                                " " +
                                item.plagiarized[0]
                                  .split(".")[1][0]
                                  .toUpperCase() +
                                item.plagiarized[0]
                                  .split(".")[1]
                                  .substring(1)
                                  .replace("@vit", "")}
                              <span className="px-3 py-1 text-xs text-red-500 rounded-full dark:bg-gray-800">
                                plagiarized
                              </span>
                            </h2>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                          <div>
                            <h2 className="text-gray-800 dark:text-white ">
                              {Math.trunc(item.plagiarism * 100) + "%"}
                            </h2>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                          <div>
                            <h2 className="text-gray-800 dark:text-white">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </h2>
                          </div>
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

      <NormalPlagiarisedTable data={data[1]} />
    </>
  );
};

export default AnalysisTable;
