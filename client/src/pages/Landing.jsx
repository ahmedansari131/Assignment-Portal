import React, { useState } from "react";
import { Button, Header } from "../components";
import { signInWithMicrosoft } from "../utils/auth.utils";
import { useNavigate } from "react-router-dom";

const Landing = (props) => {
  const {user} = props;
  const navigate = useNavigate();

  const startHandler = () => {
    if (!user) setUser(signInWithMicrosoft());
    navigate("/assignments");
  };

  return (
    <div className="bg-inherit text-inherit h-screen">

      <div className="flex justify-center items-center flex-col gap-4 py-5 h-full">
        <h2 className="text-center text-3xl font-[Roboto] font-medium">
          Seamless Submission, Confident Verification: Your Assignment Portal
        </h2>
        <Button
          text={"Get Started"}
          className={"text-lg"}
          func={startHandler}
        />
      </div>
    </div>
  );
};

export default Landing;
