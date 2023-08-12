import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { getLastBonusDate } from "../../functions/getLastBonusDate";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const LastBonusTotalWidget = () => {
  const [cad, setCad] = useState("0.00");
  const [mxn, setMxn] = useState("0.00");
  const [usd, setUsd] = useState("0.00");

  const payDate = getLastBonusDate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/payment-sum/${payDate}/1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.currency === "MXN") setMxn(item.total);
          if (item.currency === "CAD") setCad(item.total);
          if (item.currency === "USD") setUsd(item.total);
        });
      })
      .catch((error) => {
        toast.error("Error: Something went wrong.", toastProps);
      });
  }, [payDate]);

  return (
    <div>
      <h1 className="section-heading-overview">
        Previous Bonus Payment Summary
      </h1>
      <h2 className="para-text">{payDate}</h2>
      <hr />
      <p className="medium-figure">${mxn} MXN</p>
      <p className="medium-figure">${cad} CAD</p>
      <p className="medium-figure">${usd} USD</p>
      <ToastContainer transition={Flip} />
    </div>
  );
};

export default LastBonusTotalWidget;
