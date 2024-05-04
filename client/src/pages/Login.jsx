import React, { useState } from "react";
import { Input, SelectMenu, Button } from "../components";
import { Link, useNavigate } from "react-router-dom";
import {
  USER_NOT_VERIFIED,
  USER_DOES_NOT_EXIST,
  USER_LOGGEDIN,
  VERIFY_EMAIL,
} from "../../constants";
import axios from "axios";

const Login = () => {
  const [error, setError] = useState({ message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState({ email: null, role: "student" });
  const navigate = useNavigate();

  const inputChangeHandler = (e) => {
    setError({ message: "" });
    setInputData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const userLoginHandler = async () => {
    setIsLoading(true);
    if (!inputData.email) {
      setError({ message: "Email Id is required" });
      setIsLoading(false);
      return;
    }

    if (!inputData.email.endsWith("@vit.edu.in")) {
      setError({ message: "Please login using Vidyalankar's Email Id" });
      setIsLoading(false);
      return;
    }

    const url = process.env.AUTH_SERVER_URL;
    const response = await axios.post(`${url}/login/`, inputData);

    if (response.status === 200) {
      if (
        response.data.message.toLowerCase() ===
        USER_DOES_NOT_EXIST.toLowerCase()
      ) {
        setError({ message: "User with this email id does not exist" });
        setIsLoading(false);
        return;
      }

      if (
        response.data.message.toLowerCase() === USER_NOT_VERIFIED.toLowerCase()
      ) {
        setError({ message: "User is not verified" });
        setIsLoading(false);
        return;
      }

      if (response.data.message.toLowerCase() === VERIFY_EMAIL.toLowerCase()) {
        localStorage.setItem("user", response.data.user_id);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem(
          "isRegistering",
          response.data.is_registering || null
        );
        navigate("/login-verification");
      }
    }
  };

  return (
    <div className="w-full min-h-[91.5vh] flex justify-center items-center">
      <div className="flex justify-center w-full items-center">
        <div>
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Login with your college Email Address
            </h2>
            <p className="mt-4 text-lg leading-snug w-[80%] text-gray-400">
              Login using One Time Password, password is not required on this
              portal
            </p>
            <div className="mt-6 flex max-w-md gap-y-4 flex-col w-full">
              <div className="w-full">
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={inputChangeHandler}
                  placeholder="Enter your email"
                />
                {error.message && (
                  <p className="text-red-600 text-[.75rem] pl-2 pt-1">
                    {error.message}
                  </p>
                )}
              </div>
              <SelectMenu setRole={setInputData} />
              <Button func={userLoginHandler} isLoading={isLoading}>
                {" "}
                Login
              </Button>
            </div>
          </div>
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

export default Login;
