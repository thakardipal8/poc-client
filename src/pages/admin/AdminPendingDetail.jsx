import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import UserDetailsDisplay from "../../components/UserDetailsDisplay";
import InfoBox from "../../components/infoDisplayBoxes/InfoBox";
import InfoInput from "../../components/infoDisplayBoxes/InfoInput";
import { calculateDaysExcludingWeekends } from "../../functions/calculateDaysExcludingWeekends";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const AdminPendingDetail = () => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const userId = userProfile.userId;
  const selectedPayment = JSON.parse(localStorage.getItem("paymentId"));
  const displayPaymentId = selectedPayment.slice(0, 8);

  const adminNotesRef = useRef();

  // Sets payment details from API call
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [company, setCompany] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [baseComp, setBaseComp] = useState(0);
  const [currency, setCurrency] = useState();
  const [status, setStatus] = useState("pending");
  const [payrollDate, setPayrollDate] = useState("");
  const [hours, setHours] = useState(0);
  const [requiredHours, setRequiredHours] = useState();
  const [requestDate, setRequestDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("no notes");
  const [paymentAmount, setPaymentAmount] = useState("0.00");
  const [invoiceDesc, setInvoiceDesc] = useState([]);
  const [editableField, setEditableField] = useState(false);

  const setPayrollTermEndDate = (date) => {
    const endDate = new Date(date.replace(/-/g, "/").replace(/T.+/, ""));
    const year = endDate.getFullYear();
    const month = endDate.getMonth() + 1;
    const day = endDate.getDate();
    let startDay;

    if (day === 15) {
      startDay = `${year}-${month}-01`;
    } else {
      startDay = `${year}-${month}-16`;
    }
    return startDay;
  };

  const calculatePayment = (event) => {
    event.preventDefault();
    setEditableField(true);
    setRequiredHours(
      calculateDaysExcludingWeekends(
        new Date(payrollDate.replace(/-/g, "/").replace(/T.+/, "")),
        new Date(
          setPayrollTermEndDate(payrollDate)
            .replace(/-/g, "/")
            .replace(/T.+/, "")
        )
      ) * 8
    );
  };

  const submitPaymentReview = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8080/admin/payment-review/${selectedPayment}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
        requiredHours: requiredHours,
        totalPayment: paymentAmount,
        reviewedBy: userId,
        adminNotes: adminNotes,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, toastProps);
        } else {
          toast.success("Payment review has been submitted.", toastProps);
          setEditableField(false);
        }
      })
      .catch((error) => {
        toast.error("Error: Something went wrong.", toastProps);
      });
  };

  // Sets items from localStorage user profile upon first render
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API}/admin/payment-user-details/${selectedPayment}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("contractorId", JSON.stringify(data[0].userId));
        setName(`${data[0].firstName} ${data[0].lastName}`);
        setCompany(data[0].company);
        setEmail(data[0].email);
        setCity(data[0].city);
        setCountry(data[0].country);
        setPhone(data[0].phone);
        setPayrollDate(data[0].payrollDate.slice(0, 10));
        setRequestDate(data[0].requestDate.slice(0, 10));
        setHours(data[0].hoursWorked);
        setCurrency(data[0].currency);

        if (data[0].currentCompensation)
          setBaseComp(data[0].currentCompensation);

        if (data.error) {
          toast.error(data.error, toastProps);
        }
      });
    fetch(
      `${process.env.REACT_APP_API}/admin/payment-work-items/${selectedPayment}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setInvoiceDesc(data);
        if (data.error) {
          toast.error(data.error, toastProps);
        }
      });
  }, [selectedPayment, payrollDate]);

  useEffect(() => {
    setPaymentAmount(((hours / requiredHours) * baseComp).toFixed(2));

    if (!requiredHours) {
      setPaymentAmount(0.0);
    }
  }, [requiredHours, paymentAmount, baseComp, hours]);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Payment Detail</h1>
      <div className="centered-text-heading">
        <h2 className="section-heading">
          Payment details for payment id: {displayPaymentId}
        </h2>
        <p className="para-text">
          This request was submitted on: {requestDate}
        </p>
      </div>
      {/* User Details Section */}
      <UserDetailsDisplay
        name={name}
        company={company}
        email={email}
        city={city}
        country={country}
        phone={phone}
      />
      {/* Payment Details Section */}
      <div className="main-form">
        <div className="main-form-header">Payment Request Details</div>
        <div className="top-form-container">
          {/* Status section */}
          <InfoBox
            title="Status:"
            content={status}
            className="form-item"
            id="pending"
          />

          {/* Payment date section */}
          <InfoBox
            title="Payment Date:"
            content={payrollDate}
            className="form-item"
          />

          {/* Total hours section */}
          <InfoBox
            title="Hours Worked:"
            content={hours}
            className="form-item"
          />
        </div>
        {!editableField ? (
          <div className="button-container">
            <button
              className="interior-black-button"
              onClick={calculatePayment}
            >
              Calculate Payment
            </button>
          </div>
        ) : (
          <div className="top-form-container">
            {/* Required hours section */}
            <InfoInput
              title="Expected Hours:"
              type="text"
              content={requiredHours}
              className="form-item"
              value={requiredHours}
              id="required-hours-input"
              onChange={(event) => setRequiredHours(event.target.value)}
            />

            {/* Base comp section */}
            {baseComp > 0 ? (
              <InfoBox
                title="Base Compensation Rate:"
                content={`$${baseComp} ${currency}`}
                className="form-item"
              />
            ) : (
              <InfoBox
                title="Base Compensation Rate:"
                content={`Click here to set this user's base compensation rate.`}
                className="form-item"
                id="declined"
                link={true}
                path="/admin/contractor-detail"
              />
            )}

            {/* Total payment section */}
            <InfoBox
              title="Total Payment Amount:"
              content={`$${paymentAmount} ${currency}`}
              className="form-item"
            />
          </div>
        )}
        {editableField ? (
          <div className="button-container">
            <button
              className="form-button-blue"
              onClick={(event) => {
                event.preventDefault();
                setStatus("in progress");
                adminNotesRef.current.scrollIntoView();
              }}
            >
              Approve
            </button>
            <button
              className="form-button-red"
              onClick={(event) => {
                event.preventDefault();
                setStatus("declined");
                adminNotesRef.current.scrollIntoView();
              }}
            >
              Decline
            </button>
          </div>
        ) : null}
      </div>
      {/* Work Description Section */}
      <div className="main-form">
        <div className="main-form-header">Description of Work</div>
        <div className="bottom-form-container">
          {/* Maps timesheet items */}
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
              </tr>
            </thead>
            <tbody>
              {invoiceDesc.map((item) => (
                <React.Fragment key={item.itemId}>
                  <tr>
                    <td>{item.itemHours}</td>
                    <td>{`${item.itemProject} / ${item.itemProgram}`}</td>
                    <td>{item.itemDescription}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Admin Notes Section */}
      {editableField ? (
        <div className="main-form">
          {status !== "declined" ? (
            <div className="main-form-header" ref={adminNotesRef}>
              Add Administration Notes
            </div>
          ) : (
            <div className="main-form-header-declined" ref={adminNotesRef}>
              Add Reasons for Decline
            </div>
          )}
          <div className="top-form-container">
            <input
              type="textarea"
              content={adminNotes}
              className="form-item"
              id="admin-notes-input"
              onChange={(event) => setAdminNotes(event.target.value)}
            />
          </div>
          <div className="button-container">
            <button
              className="interior-black-button"
              onClick={submitPaymentReview}
            >
              Submit Review
            </button>
          </div>
        </div>
      ) : null}

      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AdminPendingDetail;
