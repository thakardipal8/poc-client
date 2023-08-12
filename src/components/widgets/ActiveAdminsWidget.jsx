import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { getTodaysDate } from "../../functions/getTodaysDate";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const ActiveAdminsWidget = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const accountType = userProfile.account;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/active-users-count/admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserCount(data[0].count))
      .catch((error) => {
        toast.error("Error: Something went wrong.", toastProps);
      });
  });

  return (
    <div>
      <h1 className="section-heading-overview">Administrators</h1>
      <h2 className="para-text">{getTodaysDate()}</h2>
      <hr />
      <p className="medium-figure">{userCount} active administrator(s)</p>
      {accountType === "superAdmin" ? (
        <button
          className="small-button-center-blue"
          onClick={() => navigate("/admin/add-administrator")}
        >
          Add Administrator
        </button>
      ) : null}
      <ToastContainer transition={Flip} />
    </div>
  );
};

export default ActiveAdminsWidget;
