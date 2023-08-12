import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const PendingPaymentsWidget = () => {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/pending-request-count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPendingCount(data[0].count);
      })
      .catch((error) => {
        toast.error("Error: Something went wrong.", toastProps);
      });
  });

  return (
    <div className="overview-button-section">
      <h2 className="section-heading-overview">Review pending payments</h2>
      <p className="para-text">
        <span className="bold-figure">{pendingCount}</span> contactor payment
        request(s) are ready to be reviewed.
      </p>
      <button
        className="interior-blue-button"
        onClick={() => navigate("/admin/pending-payments")}
      >
        View payment requests
      </button>
      <ToastContainer transition={Flip} />
    </div>
  );
};

export default PendingPaymentsWidget;
