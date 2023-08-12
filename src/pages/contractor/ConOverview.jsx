import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import PaymentStatusCount from "../../components/widgets/PaymentStatusCount";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";
import plusIcon from "../../assets/icons/plus-icon.webp";
import pendingIcon from "../../assets/icons/pending-icon.webp";
import declinedIcon from "../../assets/icons/declined-icon.webp";
import paidIcon from "../../assets/icons/paid-icon.webp";

const ConOverview = () => {
  const navigate = useNavigate();

  // Sets number of pending, declined and past payments
  const [pendingPayments, setPendingPayments] = useState(0);
  const [declinedPayments, setDeclinedPayments] = useState(0);
  const [paidPayments, setPaidPayments] = useState(0);
  const [approvedPayments, setApprovedPayments] = useState(0);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userId = userProfile.userId;

    fetch(`${process.env.REACT_APP_API}/contractor/payment-summary/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // If the server sends back a message, they do not have any payments in the db.
        // This will occur for new users, payment counts should display 0 but not provide an error.
        if (data.message) {
          setApprovedPayments(0);
          setPendingPayments(0);
          setPaidPayments(0);
          setDeclinedPayments(0);
        } else {
          // For each payment count retrieved, set to the appropriate count state.
          data.forEach((payment) => {
            if (payment.status === "pending") {
              setPendingPayments(payment.paymentCount);
            }
            if (payment.status === "declined") {
              setDeclinedPayments(payment.paymentCount);
            }
            if (payment.status === "in progress") {
              setApprovedPayments(payment.paymentCount);
            }
            if (payment.status === "paid") {
              setPaidPayments(payment.paymentCount);
            }
          });
        }
      })
      .catch((error) => {
        // If error, display a generic error alert to the user.
        toast.error("Error: Something went wrong!", toastProps);
      });
  }, []);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Overview</h1>
      <Link to="/contractor/profile" className="underlined-link">
        View/edit your profile
      </Link>
      <div className="page-content">
        {/* Payment Request Section */}
        <div className="overview-button-section">
          <h2 className="section-heading-overview">
            Make a new payment request
          </h2>
          <p className="para-text">
            Create a new invoice and submit for payment.
          </p>
          <button
            style={{ width: "20rem" }}
            className="interior-blue-button"
            onClick={() => navigate("/contractor/payment-request-form")}
          >
            <img src={plusIcon} className="button-icon" alt="white plus sign" />
            Create a new invoice
          </button>
        </div>

        {/* Pending Payments Section */}
        <PaymentStatusCount
          icon={pendingIcon}
          iconAltText="circle with a blue outline containing a blue hourglass"
          heading="View pending invoices"
          content={pendingPayments}
          url="/contractor/pending-payments"
          type="pending invoice(s)"
        />
        <hr />

        {/* Declined Payments Section */}
        <PaymentStatusCount
          icon={declinedIcon}
          iconAltText="circle with a red outline containing a red x"
          heading="View declined invoices"
          content={declinedPayments}
          url="/contractor/pending-payments"
          type="declined invoice(s)"
        />
        <hr />

        {/* Payment History Section */}
        <PaymentStatusCount
          icon={paidIcon}
          iconAltText="circle with a green outline containing a green dollar sign"
          heading="View payment history"
          content={approvedPayments + paidPayments}
          url="/contractor/payment-history"
          type="approved and/or paid invoice(s)"
        />
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default ConOverview;
