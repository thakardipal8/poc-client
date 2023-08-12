import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import UserDetailsDisplay from "../../components/UserDetailsDisplay";
import InfoBox from "../../components/infoDisplayBoxes/InfoBox";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const AdminPaymentDetail = () => {
  const selectedPayment = JSON.parse(localStorage.getItem("paymentId"));
  const displayPaymentId = selectedPayment.slice(0, 8);

  // Sets payment details from API call
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [company, setCompany] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [baseComp, setBaseComp] = useState(0);
  const [currency, setCurrency] = useState();
  const [payrollDate, setPayrollDate] = useState("");
  const [hours, setHours] = useState(0);
  const [requiredHours, setRequiredHours] = useState();
  const [requestDate, setRequestDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("no notes");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [invoiceDesc, setInvoiceDesc] = useState([]);

  useEffect(() => {
    const fetchPaymentData = async () => {
      const paymentResponse = await fetch(
        `${process.env.REACT_APP_API}/admin/payment-user-details/${selectedPayment}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
          },
        }
      );
      const paymentData = await paymentResponse.json();
      setName(`${paymentData[0].firstName} ${paymentData[0].lastName}`);
      setCompany(paymentData[0].company);
      setEmail(paymentData[0].email);
      setCity(paymentData[0].city);
      setCountry(paymentData[0].country);
      setPhone(paymentData[0].phone);
      setPayrollDate(paymentData[0].payrollDate.slice(0, 10));
      setRequestDate(paymentData[0].requestDate.slice(0, 10));
      setHours(paymentData[0].hoursWorked);
      setRequiredHours(paymentData[0].requiredHours);
      setCurrency(paymentData[0].currency);
      setBaseComp(paymentData[0].baseCompensation);
      setPaymentAmount(paymentData[0].totalPayment);

      const hasNoBonus = Number(paymentData[0].bonus) === 0;
      if (paymentData[0].adminNotes !== null)
        setAdminNotes(paymentData[0].adminNotes);

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
        setInvoiceDesc(paymentTimesheetData);
      }
    };

    fetchPaymentData().catch(() => {
      toast.error("Error: Something went wrong.", toastProps);
    });
  }, [selectedPayment]);

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
            content="approved"
            className="form-item"
            id="paid"
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
      <div className="main-form">
        <div className="main-form-header">Administration Notes</div>
        <div className="top-form-container">
          <p className="para-text">{adminNotes}</p>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AdminPaymentDetail;
