import React from "react";
import { Button } from "../components";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="bg-gray-900 text-gray-200 w-screen h-screen relative isolate overflow-hidden flex justify-center items-center">
      <div className="backdrop-blur-2xl p-10 text-white ring-1 ring-inset ring-white/10 rounded-md flex flex-col gap-4 justify-center items-center h-2/3 w-2/3">
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-extrabold text-9xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 drop-shadow-2xl">
            404
          </h1>
          <h3 className="font-bold text-xl uppercase text-gray-300">
            Oops! Page Not Found
          </h3>
        </div>
        <div>
          <p className="text-lg text-gray-500">
            Sorry, page you are looking for does not exist.
          </p>
        </div>
        <div>
          <Link to="/">
            <Button className="text-white">Return Home</Button>
          </Link>
        </div>
      </div>

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

export default Error404;
