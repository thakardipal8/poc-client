import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import InfoBox from "../../components/infoDisplayBoxes/InfoBox";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const ConPaymentDetail = () => {
  // sets paymentId from localStorage
  const [paymentId, setPaymentId] = useState("");

  // Sets payment details from API call
  const [payrollDate, setPayrollDate] = useState("");
  const [status, setStatus] = useState("N/A");
  const [hours, setHours] = useState(0);
  const [requiredHours, setRequiredHours] = useState(0);
  const [requestDate, setRequestDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("No notes.");
  const [approvedDate, setApprovedDate] = useState();
  const [baseComp, setBaseComp] = useState();
  const [currency, setCurrency] = useState();
  const [paymentAmount, setPaymentAmount] = useState();
  const [invoiceDesc, setInvoiceDesc] = useState([]);
  const [reviewer, setReviewer] = useState();

  // Manages the id of the element to adjust text color based on status type
  const [statusType, setStatusType] = useState("");

  // Sets items from localStorage user profile upon first render
  useEffect(() => {
    let selectedPayment = JSON.parse(localStorage.getItem("paymentId"));
    setPaymentId(selectedPayment.slice(0, 8));
    const fetchPaymentData = async () => {
      const paymentResponse = await fetch(
        `${process.env.REACT_APP_API}/contractor/payment-request-detail/${selectedPayment}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
          },
        }
      );
      const paymentData = await paymentResponse.json();
      if (paymentData.error) {
        toast.error(paymentData.error, toastProps);
      }
      setPayrollDate(paymentData[0].payrollDate.slice(0, 10));
      setRequestDate(paymentData[0].requestDate.slice(0, 10));
      setHours(paymentData[0].hoursWorked);
      setRequiredHours(paymentData[0].requiredHours);
      setCurrency(paymentData[0].currency);
      setStatusType(paymentData[0].status);
      setStatus(
        paymentData[0].status[0].toUpperCase() +
          paymentData[0].status.substring(1)
      );

      // Description only exists for payroll payments (bonus = 0)
      // Bonus payments are = 1 in the db and do not contain a timesheet description as they are created by admin.
      const hasNoBonus = Number(paymentData[0].bonus) === 0;

      if (paymentData[0].adminNotes !== null)
        setAdminNotes(paymentData[0].adminNotes);

      if (paymentData[0].reviewDate !== null) {
        setApprovedDate(paymentData[0].reviewDate.slice(0, 10));
        setBaseComp(paymentData[0].baseCompensation);
        setPaymentAmount(paymentData[0].totalPayment);
        setReviewer(paymentData[0].firstName + " " + paymentData[0].lastName);
      }

      if (hasNoBonus) {
        const paymentTimeSheetResponse = await fetch(
          `${process.env.REACT_APP_API}/admin/payment-work-items/${selectedPayment}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
            },
          }
        );
        const paymentTimesheetData = await paymentTimeSheetResponse.json();
        if (paymentTimesheetData.error) {
          toast.error(paymentTimesheetData.error, toastProps);
        }
        setInvoiceDesc(paymentTimesheetData);
      }
    };
    fetchPaymentData().catch(console.error);
  }, []);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Payment Detail</h1>
      <div className="centered-text-heading">
        <h2 className="section-heading">
          Payment details for payment id: {paymentId}
        </h2>
        <p className="para-text">
          This request was submitted on: {requestDate}
        </p>
        {statusType === "paid" || statusType === "in progress" ? (
          <p className="para-text">
            Approved on: {approvedDate} by {reviewer}
          </p>
        ) : null}
      </div>
      <div className="main-form">
        <div className="main-form-header">Payment Request Details</div>
        <div className="top-form-container">
          {/* Status section */}
          <InfoBox
            title="Status:"
            content={status}
            className="form-item"
            id={statusType === "in progress" ? "progress" : statusType}
          />

          {/* Payment date section */}
          <InfoBox
            title="Payment Date:"
            content={payrollDate}
            className="form-item"
          />

          {/* Total hours section */}
          <InfoBox title="Total Hours:" content={hours} className="form-item" />
        </div>

        {statusType === "paid" || statusType === "in progress" ? (
          <div className="top-form-container">
            {/* Required hours section */}
            <InfoBox
              title="Expected Hours:"
              content={requiredHours}
              className="form-item"
            />

            {/* Base comp section */}
            <InfoBox
              title="Base Compensation Rate:"
              content={`$${baseComp} ${currency}`}
              className="form-item"
            />

            {/* Total payment section */}
            <InfoBox
              title="Total Payment Amount:"
              content={`$${paymentAmount} ${currency}`}
              className="form-item"
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>

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
            {invoiceDesc.length ? (
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
            ) : (
              <tbody>
                <tr>
                  <td>{hours}</td>
                  <td>PayMate</td>
                  <td>This is a quarterly bonus payment.</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
      <div className="main-form">
        <div className="main-form-header">
          {statusType === "declined"
            ? "Reasons for Decline"
            : "Administration Notes"}
        </div>
        <div className="top-form-container">
          <p className="para-text">
            {statusType === "pending"
              ? "This request is pending administrator review."
              : adminNotes}
          </p>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default ConPaymentDetail;
