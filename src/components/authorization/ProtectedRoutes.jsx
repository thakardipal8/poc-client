import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = (props) => {
  let userProfile = JSON.parse(localStorage.getItem("userProfile"));
  let accountType = userProfile.account;

  return accountType === props.accountType || accountType === "superAdmin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoutes;
