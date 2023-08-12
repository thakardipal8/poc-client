import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../data/toastProps/toastProps";
import { setQuarterStartAndEndDates } from "../functions/setQuarterStartAndEndDates";
import { calculateDaysExcludingWeekends } from "../functions/calculateDaysExcludingWeekends";
import { parseTokenFromLocalStorage } from "../functions/parseTokenFromLocalStorage";

const AddBonusPayment = ({ currency, baseComp }) => {
  const userId = JSON.parse(localStorage.getItem("contractorId"));
  const adminProfile = JSON.parse(localStorage.getItem("userProfile"));
  const adminId = adminProfile.userId;

  const [editableField, setEditableField] = useState(false);
  const [quarter, setQuarter] = useState("");
  const [startDate, setStartDate] = useState("2022-01-01");
  const [endDate, setEndDate] = useState("2022-03-31");
  const [payrollDate, setPayrollDate] = useState();
  const [hoursWorked, setHoursWorked] = useState();
  const [hoursExpected, setHoursExpected] = useState();
  const [performanceScore, setPerformanceScore] = useState();
  const [totalBonus, setTotalBonus] = useState();
  const [requiredFieldsError, setRequiredFieldsError] = useState("");

  const toggleAddBonusButton = () => {
    if (editableField) {
      setEditableField(false);
    } else {
      setEditableField(true);
    }
  };

  const checkBonusCalculationFieldsArePopulated = () => {
    if (!hoursWorked || !hoursExpected || !baseComp || !performanceScore) {
      setRequiredFieldsError("*All fields are required.");
    } else {
      setRequiredFieldsError("");
    }
  };

  const addDecimalPointToTotalHours = (hours) =>
    Number(hours).toFixed(Math.max(hours.split(".")[1]?.length, 1) || 1);

  const calculateBonusPayment = (event) => {
    event.preventDefault();
    checkBonusCalculationFieldsArePopulated();
    const payment =
      ((hoursWorked / hoursExpected) * baseComp * performanceScore) / 4;
    typeof payment === "number"
      ? setTotalBonus(payment.toFixed(2))
      : setTotalBonus(NaN);
  };

  const submitBonusPayment = (event) => {
    event.preventDefault();
    fetch("http://localhost:8080/admin/add-bonus-payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        status: "in progress",
        hoursWorked: addDecimalPointToTotalHours(hoursWorked),
        requiredHours: hoursExpected,
        payrollDate: payrollDate,
        baseCompensation: baseComp,
        currency: currency,
        totalPayment: totalBonus,
        bonus: 1,
        reviewedBy: adminId,
        adminNotes: `Bonus payment for ${quarter}.`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, toastProps);
        } else {
          toast.success("Payment has been created", toastProps);
          setEditableField(false);
        }
      })
      .catch((error) => {
        toast.error("Error: Something went wrong.", toastProps);
      });
  };

  useEffect(() => {
    if (quarter) {
      setQuarterStartAndEndDates(
        quarter,
        setStartDate,
        setEndDate,
        setPayrollDate
      );
      fetch(
        `${process.env.REACT_APP_API}/admin/hours-worked/${userId}/${startDate}/${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data[0].hoursWorked === null) {
            setHoursWorked(0);
          } else {
            setHoursWorked(data[0].hoursWorked);
          }
          setHoursExpected(
            calculateDaysExcludingWeekends(
              new Date(startDate.replace(/-/g, "/").replace(/T.+/, "")),
              new Date(endDate.replace(/-/g, "/").replace(/T.+/, ""))
            ) * 8
          );
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error: Something went wrong!", toastProps);
        });
    }
  }, [quarter, userId, startDate, endDate]);

  return (
    <div className="container-outline">
      <div className="form-item-large-no-outline">
        <div className="form-row">
          <div className="form-row">
            <p className="bold-figure">Add a quarterly bonus payment</p>
          </div>
        </div>
        <button className="yellow-link-button" onClick={toggleAddBonusButton}>
          {!editableField ? "Add" : "Cancel"}
        </button>
      </div>
      {editableField === true ? (
        <div className="container-top-margin">
          <label className="bold-figure" htmlFor="quarter-input">
            Select applicable quarter:
          </label>
          <select
            className="text-input"
            onChange={(event) => setQuarter(event.target.value)}
            id="quarter-input"
            defaultValue={quarter}
          >
            <option value=""> </option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </div>
      ) : null}
      {editableField === true && quarter ? (
        <div>
          <div className="form-container-half-width">
            <div className="form-container-half-width">
              {requiredFieldsError && (
                <p className="error-message">{requiredFieldsError}</p>
              )}
            </div>
            <form>
              <label className="bold-figure" htmlFor="hours-worked-input">
                Hours Worked:
              </label>
              <input
                type="text"
                id="hours-worked-input"
                value={hoursWorked}
                placeholder={hoursWorked}
                className="text-input"
                onChange={(event) => setHoursWorked(event.target.value)}
              />
              <label className="bold-figure" htmlFor="expected-hours-input">
                Expected Hours:
              </label>
              <input
                type="text"
                id="expected-hours-input"
                value={hoursExpected}
                placeholder={hoursExpected}
                className="text-input"
                onChange={(event) => setHoursExpected(event.target.value)}
              />
              <label className="bold-figure" htmlFor="base-comp-input">
                Base Compensation Rate ({currency}):
              </label>
              <p className="text-input">{baseComp}</p>
              <label className="bold-figure" htmlFor="performance-input">
                Performance Score (between 1 and 4):
              </label>
              <input
                type="number"
                id="performance-input"
                max="4"
                value={performanceScore}
                className="text-input"
                onChange={(event) => setPerformanceScore(event.target.value)}
              />
              <label className="bold-figure" htmlFor="total-bonus-input">
                Total Bonus Payment:
              </label>
              <p className="text-input">{totalBonus}</p>
              <button className="form-button" onClick={calculateBonusPayment}>
                Calculate
              </button>
            </form>
          </div>
          {totalBonus > 0 && !isNaN(totalBonus) ? (
            <div className="container-top-margin">
              <p className="bold-figure">
                Would you like to create this bonus payment?{" "}
                <span className="para-text">(payable on {payrollDate})</span>
              </p>
              <button className="form-button-blue" onClick={submitBonusPayment}>
                Yes
              </button>
              <button
                className="form-button-red"
                onClick={() => {
                  setEditableField(false);
                  setTotalBonus();
                }}
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      <ToastContainer transition={Flip} />
    </div>
  );
};

export default AddBonusPayment;
