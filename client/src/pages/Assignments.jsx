import React, { useEffect, useState } from "react";
import { Button, Header } from "../components";
import axios from "axios";

const Assignments = () => {
  const [assignments, setAssignments] = useState(null);
  const people = [
    {
      name: "Leslie Alexander",
      email: "leslie.alexander@example.com",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Michael Foster",
      email: "michael.foster@example.com",
      role: "Co-Founder / CTO",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Dries Vincent",
      email: "dries.vincent@example.com",
      role: "Business Relations",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastSeen: null,
    },
    {
      name: "Lindsay Walton",
      email: "lindsay.walton@example.com",
      role: "Front-end Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Courtney Henry",
      email: "courtney.henry@example.com",
      role: "Designer",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastSeen: "3h ago",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "Tom Cook",
      email: "tom.cook@example.com",
      role: "Director of Product",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      lastSeen: null,
    },
  ];
  const fetchAssignments = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/assignment/?user_id=${userId}`
      );
      console.log(response.data.data);
      setAssignments(response.data.data);
    } catch (error) {
      console.error("Error occurred while posting data ", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <>
      <div className="bg-gray-800 px-5 py-2">
        <Button className={"text-gray-200"} text={"Create Assignments"} />
      </div>

      <div className="px-5 py-4">
        <h2 className="text-xl font-medium">Your Assignments</h2>

        <div>
          <ul role="list" className="divide-y divide-gray-100">
            {assignments?.map((item) => (
              <li
                key={item.name}
                className="flex justify-between gap-x-6 py-5 bg-gray-300 px-4 rounded-md mt-3"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {item.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      Due Date: {item.dueDate}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    Created By{" "}
                    <span className="font-medium">{item.createdBy.displayName}</span>
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Assignments;
