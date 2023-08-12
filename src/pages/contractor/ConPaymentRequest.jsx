import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import InfoBox from "../../components/infoDisplayBoxes/InfoBox";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const ConPaymentRequest = () => {
  const navigate = useNavigate();

  // Sets userId from localStorage
  const [userId, setUserId] = useState("");

  // Manages selected payment date, preferred currency and total hours
  const [payrollDate, setPayrollDate] = useState();
  const [currency, setCurrency] = useState("");
  const [totalHours, setTotalHours] = useState(0);

  // Manages individual timesheet items
  const [itemId, setItemId] = useState(nanoid());
  const [itemHours, setItemHours] = useState(0);
  const [itemProject, setItemProject] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  // Stores all items added to timesheet in array
  const [allInvoiceItems, setAllInvoiceItems] = useState([]);

  const [projects, setProjects] = useState([]);

  // Manages required field error messages
  const [hoursError, setHoursError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [currencyError, setCurrencyError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [payrollDateError, setPayrollDateError] = useState("");

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (project !== undefined) {
      return `${project.project_name} / ${project.program}`;
    }
    return "";
  };

  // Creates object for each timesheet item added to invoice
  let invoiceItem = {
    itemId: itemId,
    itemHours: itemHours,
    itemProject: itemProject,
    itemDescription: itemDescription,
  };

  const handleProjectSelection = (e) => {
    setItemProject(e.target.value);
  };

  // Validates timesheet item fields: hours, project and description
  const validateTimesheetItem = () => {
    if (!itemHours || itemHours === 0) {
      setHoursError("*hours cannot be blank");
    } else {
      setHoursError("");
    }

    if (!itemProject) {
      setProjectError("*Project / Program cannot be blank");
    } else {
      setProjectError("");
    }

    if (!itemDescription) {
      setDescriptionError("*description cannot be blank");
    } else {
      setDescriptionError("");
    }
  };

  // Handles add timesheet item
  const handleAddTimesheetItem = (event) => {
    event.preventDefault();
    validateTimesheetItem();

    if (itemHours && itemProject && itemDescription) {
      setItemId(nanoid());
      setTotalHours(totalHours + parseFloat(itemHours));
      setAllInvoiceItems((arr) => [...arr, invoiceItem]);
      event.target.reset();
      setItemHours(0);
      setItemProject("");
      setItemDescription("");
    }
  };

  // Validates payroll date and currency form fields on form submission
  // The else condition sets errors back to empty after an error has been corrected
  const validateRequestForm = () => {
    if (!payrollDate) {
      setPayrollDateError("*payment date is required");
    } else {
      setPayrollDateError("");
    }

    if (!currency) {
      setCurrencyError("*preferred currency is required");
    } else {
      setCurrencyError("");
    }

    if (payrollDate && currency && !totalHours) {
      toast.error("You cannot submit a timesheet with 0 hours.", toastProps);
    }
  };

  // Handles form submission
  const handleRequestFormSubmission = (event) => {
    event.preventDefault();
    validateRequestForm();

    const invoiceArrayToObject = { ...allInvoiceItems };

    // If there are no errors and there are hours on the invoice, it will make the POST request.
    // Payroll payments set the bonus db column to 0. Bonus payments are set to 1.
    if (!currencyError && !payrollDateError && totalHours) {
      fetch(
        `${process.env.REACT_APP_API}/contractor/submit-payment-request/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "pending",
            hoursWorked: totalHours,
            description: JSON.stringify(invoiceArrayToObject),
            payrollDate: payrollDate,
            currency: currency,
            bonus: 0,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Resets the form and alerts the user of successful submission.
          // data.message only exists if successful request.
          if (data.message) {
            toast.success(data.message, toastProps);
            setPayrollDate("");
            setTotalHours(0);
            setAllInvoiceItems([]);
          }
        })
        // Provides generic error to user.
        .catch((error) => {
          toast.error("Error: Something went wrong", toastProps);
        });
    }
  };

  // Deletes item from timesheet
  const deleteTimesheetItem = (id) => {
    const index = allInvoiceItems.findIndex((object) => object.itemId === id);
    setTotalHours(totalHours - parseFloat(allInvoiceItems[index].itemHours));
    allInvoiceItems.splice(index, 1);
  };

  // Sets items from localStorage user profile upon first render
  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    setUserId(userProfile.userId);
    setCurrency(userProfile.currency);
    fetch(`${process.env.REACT_APP_API}/contractor/projects`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setProjects(data);
        }
      });
  }, []);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Create New Invoice</h1>
      <div className="centered-text-heading">
        <h2 className="section-heading">
          Please fill out the timesheet below to submit a payment request.
        </h2>
        <p className="para-text">
          Once submitted, an administrator will review your invoice. Pending
          invoices can be found under Pending Invoices.
        </p>
      </div>
      <div className="main-form">
        <div className="main-form-header">Payment Request Details</div>
        <div className="top-form-container">
          {/* Pay period date picker dropdown */}
          <div className="form-item">
            <h3 className="plain-text-heading">Select Payment Date:</h3>
            <DatePicker
              selected={payrollDate}
              onChange={(date) => setPayrollDate(date)}
              className="text-input"
            />
            {payrollDateError && (
              <p className="error-message">{payrollDateError}</p>
            )}
          </div>
          {/* Select preferred currency dropdown */}
          <div className="form-item">
            <h3 className="plain-text-heading">Currency:</h3>
            {currency ? (
              <p className="bold-figure">{currency}</p>
            ) : (
              <p className="warning-text">
                Currency must be set{" "}
                <span
                  className="warning-bold-text"
                  onClick={() => navigate("/contractor/profile")}
                >
                  HERE
                </span>{" "}
                before submitting a payment request.
              </p>
            )}
            {currencyError && <p className="error-message">{currencyError}</p>}
          </div>
          {/* Displays total hours */}
          <InfoBox
            title="Total Hours:"
            content={totalHours}
            className="form-item"
          />
        </div>
      </div>
      <div className="main-form">
        <div className="main-form-header">Description of Work</div>
        <div className="bottom-form-container">
          {/* Maps timesheet items if they exist, else show no items message */}
          {allInvoiceItems.length ? (
            <table className="payment-request-table">
              <thead>
                <tr>
                  <th className="table-heading" id="table-hours">
                    Hours:
                  </th>
                  <th className="table-heading" id="table-project">
                    Project / Program:
                  </th>
                  <th className="table-heading" id="table-description">
                    Description:
                  </th>
                  <th className="table-heading" id="table-delete">
                    Remove:
                  </th>
                </tr>
              </thead>
              <tbody>
                {allInvoiceItems.map((item) => (
                  <React.Fragment key={item.itemId}>
                    <tr>
                      <td>{item.itemHours}</td>
                      <td>{getProjectName(item.itemProject)}</td>
                      <td>{item.itemDescription}</td>
                      <td>
                        <img
                          src={deleteIcon}
                          alt="black outline of a garbage can"
                          title="delete item"
                          className="delete-icon"
                          onClick={() => deleteTimesheetItem(item.itemId)}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <h2 className="section-heading-overview">
              There are no items on your timesheet. Add items with the form
              below.
            </h2>
          )}
          <hr />
          {/* Add timesheet items form */}
          <form
            className="payment-request-form"
            onSubmit={handleAddTimesheetItem}
          >
            <div className="smallest-form-item">
              <label htmlFor="hoursWorked" className="plain-text-heading">
                Hours:
              </label>
              <input
                type="number"
                id="hoursWorked"
                min="0"
                max="100"
                step="0.5"
                className="request-form-input"
                onChange={(event) => setItemHours(event.target.value)}
                onInput={(event) => setItemHours(event.target.value)}
              />
              {hoursError && (
                <span className="error-message">{hoursError}</span>
              )}
            </div>
            <div className="small-form-item">
              <label htmlFor="clientProject" className="plain-text-heading">
                Project / Program:
              </label>
              <select
                id="clientProject"
                value={itemProject}
                onChange={handleProjectSelection}
              >
                <option value={0}>Select Project / Program</option>
                {projects.length > 0 &&
                  projects.map((p) => (
                    <>
                      <option key={p.id} value={p.id}>
                        {`${p.project_name} / ${p.program}`}
                      </option>
                    </>
                  ))}
              </select>
              {projectError && (
                <span className="error-message">{projectError}</span>
              )}
            </div>
            <div className="large-form-item">
              <label htmlFor="itemDescription" className="plain-text-heading">
                Description:
              </label>
              <input
                type="text"
                id="itemDescription"
                className="request-form-input"
                onChange={(event) => setItemDescription(event.target.value)}
                onInput={(event) => setItemDescription(event.target.value)}
              />
              {descriptionError && (
                <span className="error-message">{descriptionError}</span>
              )}
            </div>
            <button className="form-button">Add Item</button>
          </form>
        </div>
      </div>
      {/* Submit invoice */}
      <div className="button-container">
        <button
          className="interior-black-button"
          onClick={handleRequestFormSubmission}
        >
          Submit Form
        </button>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default ConPaymentRequest;
