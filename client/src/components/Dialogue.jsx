import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "./Button";
import Form from "./Form";
import { ASSIGNMENT_CREATED } from "../../constants";
import axios from "axios";
import useGetAssignments from "../hooks/useGetAssignments";

const Dialogue = ({ open, setOpen }, ref) => {
  const cancelButtonRef = useRef(null);
  const { getAssignments } = useGetAssignments();
  const [inputData, setInputData] = useState({
    title: "",
    subject: "",
    createdBy: JSON.parse(localStorage.getItem("user")),
  });

  const createAssignmentHandler = async () => {
    if (
      !inputData.title &&
      !inputData.subject &&
      !inputData.createdBy
    )
      return;

    try {
      const url = process.env.PORTAL_SERVER_URL;
      console.log(url);
      const response = await axios.post(
        `${url}/create-assignment/`,
        inputData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );

      if (
        response.data.message.toLowerCase() === ASSIGNMENT_CREATED.toLowerCase()
      ) {
        setInputData({
          title: "",
          subject: "",
        });
        getAssignments();
        setOpen(false);
      }
    } catch (error) {
      console.log("Error occurred while creating assignments -> ", error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 w-full">
                  <div className="">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-semibold leading-6 text-gray-900"
                      >
                        Assignment
                      </Dialog.Title>
                      <div className="w-full">
                        <Form setInputData={setInputData} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-4 justify-end">
                  <Button text={"Create"} func={createAssignmentHandler} />
                  <Button
                    className={
                      "bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-200"
                    }
                    text={"Cancel"}
                    type="button"
                    func={() => setOpen(false)}
                    ref={cancelButtonRef}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default React.forwardRef(Dialogue);
