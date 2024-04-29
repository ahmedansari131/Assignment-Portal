import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Assignments } from "../pages";

const PrivateRoutes = ({ Components }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn.status);

  return <>{isLoggedIn ? <Components /> : <Navigate to="/login" />}</>;
};

export default PrivateRoutes;
