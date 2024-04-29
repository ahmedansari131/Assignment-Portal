import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Error } from "../components";
import axios from "axios";
import {
  EXPIRED_OTP,
  INCORRECT_OTP,
  CORRECT_OTP,
  USER_LOGGEDIN,
  WILL_BE_NOTIFIED,
} from "../../constants";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../app/slice/login.slice";

const OTP = () => {
  const [inputError, setInputError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const digOneRef = useRef();
  const digTwoRef = useRef();
  const digThreeRef = useRef();
  const digFourRef = useRef();
  const digFiveRef = useRef();
  const digSixRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleKeyDown = (e, currentRef, prevRef, nextRef) => {
    if (e.key === "Backspace") {
      if (prevRef && currentRef.current.value === "") {
        prevRef.current.focus();
      }
    }

    if (prevRef) {
      if (e.key === "ArrowLeft") {
        prevRef.current.focus();
      }
    }

    if (nextRef) {
      if (e.key === "ArrowRight") {
        nextRef.current.focus();
      }
    }
  };

  const handleChange = (currentRef, nextRef) => {
    const value = currentRef.current.value;
    if (!isNaN(value) && value.length === 1) {
      currentRef.current.value = value;
      if (nextRef) {
        nextRef.current.focus();
      }
    } else {
      currentRef.current.value = "";
    }
  };

  const handleEmailVerification = async () => {
    setIsLoading(true);
    const otp =
      String(digOneRef.current.value) +
      String(digTwoRef.current.value) +
      String(digThreeRef.current.value) +
      String(digFourRef.current.value) +
      String(digFiveRef.current.value) +
      String(digSixRef.current.value);

    const postData = {
      otp: otp,
      user_id: localStorage.getItem("user"),
    };

    if (
      digOneRef.current.value === "" &&
      digTwoRef.current.value === "" &&
      digThreeRef.current.value === "" &&
      digFourRef.current.value === "" &&
      digFiveRef.current.value === "" &&
      digSixRef.current.value === ""
    ) {
      setInputError("Field cannot be empty");
      setIsLoading(false);
      return;
    }

    const url = process.env.AUTH_SERVER_URL;
    const teacher_url = `${url}/verify-teacher-email/`;
    const role = localStorage.getItem("role");
    const isRegistering = JSON.parse(localStorage.getItem("isRegistering"));
    try {
      const response = await axios.post(
        role.toLowerCase() === "teacher" && isRegistering ? teacher_url : `${url}/verify-login/`,
        postData
      );

      if (response.data.message.toLowerCase() === INCORRECT_OTP.toLowerCase()) {
        setInputError("Incorrect OTP");
        setIsLoading(false);
        return;
      }

      if (response.data.message.toLowerCase() === EXPIRED_OTP.toLowerCase()) {
        setInputError("OTP is expired, check you mail for new OTP");
        setIsLoading(false);
        return;
      }

      if (
        response.data.message.toLowerCase() === WILL_BE_NOTIFIED.toLowerCase()
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("isRegistering");
        navigate("/teacher-verification");
        return;
      }

      if (response.data.message.toLowerCase() === USER_LOGGEDIN.toLowerCase()) {
        dispatch(setLoggedIn(true));
        localStorage.setItem("access", response.data.Access_Token);
        localStorage.setItem("refresh", response.data.Refresh_Token);
        localStorage.removeItem("user");
        localStorage.removeItem("isRegistering");
        navigate("/");
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error occurred while verifying the email -> ", error);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center min-h-[91.5vh]">
        <div className="backdrop-blur-lg p-10 w-1/3 text-white ring-1 ring-inset ring-white/10 rounded-md flex flex-col h-70 justify-center">
          <div className="text-white mb-5">
            <h2 className="text-3xl font-semibold">Login Verification</h2>
            <p className="text-gray-400 text-sm mt-2">
              Check your email for the otp
            </p>
          </div>
          <div className="flex gap-3">
            <Input
              onChange={() => {
                handleChange(digOneRef, digTwoRef);
              }}
              onKeyDown={(e) => handleKeyDown(e, digOneRef, null, digTwoRef)}
              ref={digOneRef}
              className="text-center text-2xl"
            />
            <Input
              onChange={() => handleChange(digTwoRef, digThreeRef)}
              onKeyDown={(e) =>
                handleKeyDown(e, digTwoRef, digOneRef, digThreeRef)
              }
              ref={digTwoRef}
              className="text-center text-2xl"
            />
            <Input
              onChange={() => handleChange(digThreeRef, digFourRef)}
              onKeyDown={(e) =>
                handleKeyDown(e, digThreeRef, digTwoRef, digFourRef)
              }
              ref={digThreeRef}
              className="text-center text-2xl"
            />
            <Input
              onChange={() => handleChange(digFourRef, digFiveRef)}
              onKeyDown={(e) =>
                handleKeyDown(e, digFourRef, digThreeRef, digFiveRef)
              }
              ref={digFourRef}
              className="text-center text-2xl"
            />
            <Input
              onChange={() => handleChange(digFiveRef, digSixRef)}
              onKeyDown={(e) =>
                handleKeyDown(e, digFiveRef, digFourRef, digSixRef)
              }
              ref={digFiveRef}
              className="text-center text-2xl"
            />
            <Input
              onChange={() => handleChange(digSixRef, null)}
              onKeyDown={(e) => handleKeyDown(e, digSixRef, digFiveRef, null)}
              ref={digSixRef}
              className="text-center text-2xl"
            />
          </div>
          <div className="h-4 mt-2">
            {inputError && <Error message={inputError} />}
          </div>
          <div className="mt-2">
            <Button
              text={"Verify"}
              className="transition duration-300"
              func={handleEmailVerification}
            />
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
    </>
  );
};

export default OTP;
