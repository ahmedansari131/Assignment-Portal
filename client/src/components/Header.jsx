import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../app/slice/login.slice";

const navigation = [
  // { name: "Dashboard", href: "#", current: true },
  // { name: "Team", href: "#", current: false },
  // { name: "Projects", href: "#", current: false },
  // { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("access")) {
      const token = localStorage.getItem("access");

      if (token !== "undefined") {
        const tokenParts = token.split(".");
        const payload = tokenParts[1];

        const decodedPayload = atob(payload);

        const tokenData = JSON.parse(decodedPayload);
        localStorage.setItem("role", tokenData.role);
        localStorage.setItem("user", tokenData.user_id);
        localStorage.setItem("email", tokenData.email);
        setIsLoggedIn(true);
      }
    }
  }, [localStorage.getItem("access")]);

  const logoutHandler = () => {
    dispatch(setLoggedIn(false));
    setIsLoggedIn(false);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("isRegistering");
    navigate("/");
  };

  return (
    <Disclosure
      as="nav"
      className="bg-transparent border-b border-gray-700 border-opacity-50 sticky w-full z-[100] top-0 left-0"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to={"/"}>
                    <h1 className="font-medium text-xl">Assignment Portal</h1>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-5">
                <div className="flex items-center gap-3">
                  {!isLoggedIn && (
                    <Link to={"login/"}>
                      <Button text={"Login"} />
                    </Link>
                  )}
                </div>
                {isLoggedIn && (
                  <>
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            alt="Profile Image"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <p
                                className={
                                  "block px-4 py-2 text-sm text-gray-200 bg-indigo-600 pointer-events-none font-medium"
                                }
                              >
                                {localStorage.getItem("email").slice(0, 18) +
                                  "..."}
                              </p>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <p
                                onClick={logoutHandler}
                                className={
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-200 mt-1"
                                }
                              >
                                Logout
                              </p>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <div className="relative group transition-all duration-200">
                      <p className="bg-indigo-500 bg-opacity-50 px-4 py-2 rounded-md ml-5 font-medium border border-indigo-500 cursor-default select-none">
                        {localStorage.getItem("role").charAt(0).toUpperCase() +
                          localStorage.getItem("role").slice(1)}
                      </p>
                      <div className="absolute mx-2 opacity-0 w-full translate-y-9 group-hover:opacity-100 group-hover:translate-y-2 pointer-events-none transition-all duration-300 left-1/2">
                        <div className="bg-indigo-500 bg-opacity-50 text-white text-xs rounded py-2 px-4  bottom-full w-fit -translate-x-1/2">
                          {localStorage.getItem("email")}
                          <svg
                            className="absolute text-indigo-500 text-opacity-50 h-2 w-full left-0 bottom-full rotate-180"
                            x="0px"
                            y="0px"
                            viewBox="0 0 255 255"
                            xmlSpace="preserve"
                          >
                            <polygon
                              className="fill-current"
                              points="0,0 127.5,127.5 255,0"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
