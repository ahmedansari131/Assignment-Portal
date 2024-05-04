import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ Components }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn.status);

  return <>{isLoggedIn ? <Components /> : <Navigate to="/login" />}</>;
};

export default PrivateRoutes;
