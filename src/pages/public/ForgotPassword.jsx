import { useState } from "react";
import { Link } from "react-router-dom";
import GradientContainer from "../../components/GradientContainer";
import payMateLogo from "../../assets/logos/Paylogo.webp";

const ForgotPassword = () => {
  // Manages form fields
  const [userEmail, setUserEmail] = useState("");

  // Manages form field errors
  const [emailError, setEmailError] = useState("");

  // Validates form fields on form submit attempt
  const validateForm = () => {
    if (!userEmail) {
      setEmailError("*required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userEmail)) {
      setEmailError("*please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Handles form submission
  const handleLoginFormSubmit = (event) => {
    event.preventDefault();
    validateForm();
  };

  return (
    <div className="guest-page-background">
      <main className="guest-page-content">
        <div className="guest-content-left">
          <img src={payMateLogo} className="paymate-logo" alt="Logo" />
          <div className="left-flex-content">
            <div className="guest-content-text">
              <h1 className="guest-page-heading">Reset password</h1>
              <p className="guest-para-text">
                Please enter the email associated with your account. We'll send
                you a link to reset your password.
              </p>
              <form
                className="guest-form"
                noValidate
                onSubmit={handleLoginFormSubmit}
              >
                <label htmlFor="email">Email: </label>
                {emailError && (
                  <span className="error-message">{emailError}</span>
                )}
                <input
                  type="email"
                  id="email"
                  className="text-input"
                  onChange={(event) => setUserEmail(event.target.value)}
                />
                <button type="submit" className="exterior-main-button">
                  Reset Password
                </button>
              </form>
              <Link to={"/"} className="plain-text-link">
                Go back to Login page
              </Link>
              <p className="guest-para-text">
                Don't have an account?{" "}
                <Link to={"/signup"} className="accent-link">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
        <GradientContainer text="Let us help" />
      </main>
    </div>
  );
};

export default ForgotPassword;
