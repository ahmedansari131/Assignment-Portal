import React from "react";

const Form = (props) => {
  const { setInputData } = props;

  return (
    <form className="w-full">
      <div className="w-full">
        <div className="w-full">
          <div className="flex mt-5 items-center justify-between w-full gap-4">
            <div className="w-full">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2 w-full">
                <input
                  onChange={(e) =>
                    setInputData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Title"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Subject
              </label>
              <div className="mt-2 w-full">
                <input
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Subject"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="flex mt-5 items-center justify-between w-full gap-4">
            
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
