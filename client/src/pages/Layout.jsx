import React, { useEffect, useState } from "react";
import { Container, Header } from "../components";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedIn, setRole } from "../app/slice/login.slice";
import LoaderPage from "./LoaderPage";

const Layout = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn.status);
  const [isLoading, setIsLoading] = useState(true);

  const updateToken = async () => {
    const getRefreshToken = localStorage.getItem("refresh");
    const url = "http://127.0.0.1:8000/api/token/refresh/";
    if (getRefreshToken) {
      const response = await axios.post(url, { refresh: getRefreshToken });
      if (response.data) {
        localStorage.setItem("access", response.data.access);
      }
    }
  };

  useEffect(() => {
    updateToken();
    let time = 1000 * 60 * 15;
    let interval = setInterval(() => {
      updateToken();
    }, time);
    return () => clearInterval(interval);
  }, []);

  const loaderHandler = () => {
    if (!isLoggedIn) {
      return <LoaderPage />;
    }
  };

  useEffect(() => {
    const fetchLoginStatus = () => {
      const isLoggedIn = localStorage.getItem("access") ? true : false;
      const role = localStorage.getItem("role");
      dispatch(setLoggedIn(isLoggedIn));
      dispatch(setRole(role));
      setIsLoading(false);
    };

    fetchLoginStatus();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoaderPage />
      ) : (
        <Container>
          <Header />
          <Outlet />
        </Container>
      )}
    </>
  );
};

export default Layout;
