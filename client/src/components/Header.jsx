import React, { useEffect, useState } from "react";
import { Button } from "../components";
import {
  signInWithMicrosoft,
  auth,
  signOutWithMicrosoft,
} from "../utils/auth.utils";
import { onAuthStateChanged } from "firebase/auth";
import Dropdown from "./Dropdown";
import axios from "axios";

const Header = (props) => {
  const {user, setUser} = props

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
        console.log("User is not loggedin");
      }
    });
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/getuser/",
        user
      );
      localStorage.setItem("userId", JSON.stringify(response.data.userId))
    } catch (error) {
      console.error("Error occurred while posting data ", error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  return (
    <div className="flex items-center justify-between py-2 px-6 border-b border-gray-700 text-gray-200">
      <h1 className="text-xl">Assignment Portal</h1>
      {user ? (
        <>
          <Dropdown
            signoutFunc={signOutWithMicrosoft}
            options={["Your Profile", "Sign out"]}
            displayName={user?.displayName}
            header={
              <img
                className="rounded-full cursor-pointer"
                width={40}
                height={40}
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="profile image"
              />
            }
          />
        </>
      ) : (
        <Button text={"Sign In"} func={() => setUser(signInWithMicrosoft())} />
      )}
    </div>
  );
};

export default Header;
