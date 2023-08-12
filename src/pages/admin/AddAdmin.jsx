import React, { useState } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const AddAdmin = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [accountTypeError, setAccountTypeError] = useState("");

  // Validates form fields on form submit attempt
  // Else statement resets field after an error is fixed
  const validateForm = () => {
    if (!firstName) {
      setFirstNameError("*required");
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("*required");
    } else {
      setLastNameError("");
    }

    if (!email) {
      setEmailError("*required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailError("*please enter a valid email address");
    } else {
      setEmailError("");
    }
    // Password must be between 8 and 20 characters and contain at least 1 letter and 1 number as per Regex below.
    if (!password) {
      setPasswordError("*required");
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(password)) {
      setPasswordError(
        "*must be between 8-20 characters & contain at least 1 letter and 1 number"
      );
    } else {
      setPasswordError("");
    }

    if (!accountType) {
      setAccountTypeError("*required");
    } else {
      setAccountTypeError("");
    }
  };

  // Handles form submission
  const handleAdminFormSubmit = (event) => {
    event.preventDefault();
    validateForm();
    fetch("http://localhost:8080/admin/add-administrator", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        accountType: accountType,
        company: "Piece of Cake",
        status: "active",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Alerts user of successful POST and resets form
        if (data.message) {
          toast.success(data.message, toastProps);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setAccountType("");
        }
      })
      .catch((error) => {
        // Provides generic error to user
        toast.error("Error: Something went wrong.", toastProps);
      });
  };

  return (
    <main className="page-layout">
      <h1 className="page-heading">Add Administrator</h1>
      <div className="centered-text-heading">
        <h2 className="section-heading">Create a new admin user</h2>
        <p className="para-text">
          Fill out the form below to add a new admin to your organization.
        </p>
      </div>
      <div className="main-form">
        <div className="main-form-header">User Details</div>
        <div className="form-container-half-width">
          <form
            className="admin-form"
            noValidate
            onSubmit={handleAdminFormSubmit}
          >
            {/* First name field */}
            <label htmlFor="firstName">First Name: </label>
            {firstNameError && (
              <span className="error-message">{firstNameError}</span>
            )}
            <input
              type="text"
              id="firstName"
              value={firstName}
              className="text-input"
              onChange={(event) => setFirstName(event.target.value)}
            />

            {/* Last name field */}
            <label htmlFor="lastName">Last Name: </label>
            {lastNameError && (
              <span className="error-message">{lastNameError}</span>
            )}
            <input
              type="text"
              id="lastName"
              value={lastName}
              className="text-input"
              onChange={(event) => setLastName(event.target.value)}
            />

            {/* Email field */}
            <label htmlFor="email">Email: </label>
            {emailError && <span className="error-message">{emailError}</span>}
            <input
              type="email"
              id="email"
              value={email}
              className="text-input"
              onChange={(event) => setEmail(event.target.value)}
            />

            {/* Password field */}
            <label htmlFor="password">Password: </label>
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
            <input
              type="password"
              id="password"
              value={password}
              className="text-input"
              onChange={(event) => setPassword(event.target.value)}
            />

            {/* Account type field */}
            <label htmlFor="accountType">Account Type: </label>
            {accountTypeError && (
              <span className="error-message">{accountTypeError}</span>
            )}
            <select
              className="text-input"
              id="accountType"
              value={accountType}
              onChange={(event) => setAccountType(event.target.value)}
            >
              <option value=""></option>
              <option value="admin">admin</option>
              <option value="superAdmin">superAdmin</option>
            </select>

            {/* Submit */}
            <button type="submit" className="exterior-main-button">
              Create account
            </button>
          </form>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AddAdmin;
