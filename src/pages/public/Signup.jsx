import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import GradientContainer from "../../components/GradientContainer";
import payMateLogo from "../../assets/logos/Paylogo.webp";
import showPasswordIcon from "../../assets/icons/eye.webp";
import hidePasswordIcon from "../../assets/icons/hide-eye.webp";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  // Manages form fields
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [company, setCompany] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userLocation, setUserLocation] = useState("");

  const [usernameSuccess, setUsernameSuccess] = useState("");

  // Manages form field errors
  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [userEmailError, setUserEmailError] = useState("");
  const [userPasswordError, setUserPasswordError] = useState("");
  const [userLocationError, setUserLocationError] = useState("");

  // Manages show/hide password
  const [showPassword, setShowPassword] = useState("password");

  // Manages show/hide password icon
  const [passwordIcon, setPasswordIcon] = useState(showPasswordIcon);
  const [passwordIconTitle, setPasswordIconTitle] = useState("show password");

  // Toggles show/hide password on click
  const togglePassword = () => {
    if (showPassword === "password") {
      setShowPassword("text");
      setPasswordIcon(hidePasswordIcon);
      setPasswordIconTitle("hide password");
    }

    if (showPassword === "text") {
      setShowPassword("password");
      setPasswordIcon(showPasswordIcon);
      setPasswordIconTitle("show password");
    }
  };

  const validateUsername = (e) => {
    e.preventDefault();
    const usernameValue = e.target.value;
    if (usernameValue.length > 0) {
      setUsername(e.target.value);
      fetch(`${process.env.REACT_APP_API}/username-validate/${usernameValue}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error, toastProps);
            setUsernameError(data.error);
            setUsernameSuccess("");
          } else if (data.message) {
            setUsernameSuccess(data.message);
            setUsernameError("");
          } else {
            setUsernameError("");
            setUsernameSuccess("");
          }
        });
    } else {
      setUsernameError("*required");
    }
  };

  // Validates form fields on form submit attempt
  const validateForm = () => {
    !username ? setUsernameError("*required") : setUsernameError("");
    !firstName ? setFirstNameError("*required") : setFirstNameError("");

    !lastName ? setLastNameError("*required") : setLastNameError("");

    if (!userEmail) {
      setUserEmailError("*required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userEmail)) {
      setUserEmailError("*please enter a valid email address");
    } else {
      setUserEmailError("");
    }
    // Password must be between 8 and 20 characters and contain at least 1 letter and 1 number as per Regex below.
    if (!userPassword) {
      setUserPasswordError("*required");
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(userPassword)) {
      setUserPasswordError(
        "*must be between 8-20 characters & contain at least 1 letter and 1 number"
      );
    } else {
      setUserPasswordError("");
    }

    if (!dateOfBirth) {
      setDateOfBirthError("*required");
    } else if (!/Date/.test(dateOfBirth)) {
      setDateOfBirthError("yyyy/mm/dd");
    } else {
      setDateOfBirthError("");
    }

    !userLocation
      ? setUserLocationError("*required")
      : setUserLocationError("");
  };

  // Handles form submission
  const handleSignupFormSubmit = (event) => {
    event.preventDefault();
    validateForm();
    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        company,
        email: userEmail,
        password: userPassword,
        location: userLocation,
        city: "not provided",
        accountType: "contractor",
        status: "active",
        phone: "not provided",
        dateOfBirth,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          toast.success(data.message, toastProps);
          setUsername("");
          setFirstName("");
          setLastName("");
          setDateOfBirth("");
          setCompany("");
          setUserEmail("");
          setUserPassword("");
          setUserLocation("");
        }

        if (data.error) {
          toast.error(data.error, toastProps);
        }
      });
  };

  return (
    <div className="guest-page-background">
      <main className="guest-page-content-two">
        <div className="guest-content-left">
          <img src={payMateLogo} className="paymate-logo" alt="Logo" />
          <div className="left-flex-content">
            <div className="guest-content-text">
              <h1 className="guest-page-heading">Create an account</h1>
              <p className="guest-para-text">
                Let's get started. Please enter your details.
              </p>
              <form
                className="guest-form"
                noValidate
                onSubmit={handleSignupFormSubmit}
              >
                {/* Username field */}
                <label htmlFor="username">Username: </label>
                {usernameError && (
                  <span className="error-message">{usernameError}</span>
                )}
                {usernameSuccess && (
                  <span className="success-message">{usernameSuccess}</span>
                )}
                <input
                  type="text"
                  id="username"
                  className="text-input"
                  onBlur={validateUsername}
                />
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

                {/* Date of Birth field*/}
                <label htmlFor="dateOfBirth">Date of Birth: </label>
                {dateOfBirthError && (
                  <span className="error-message">{dateOfBirthError}</span>
                )}
                <input
                  type="date"
                  id="dateOfBirth"
                  className="text-input"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                />

                {/* Company field */}
                <label htmlFor="company">Company (optional): </label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  className="text-input"
                  onChange={(event) => setCompany(event.target.value)}
                />

                {/* Email field */}
                <label htmlFor="email">Email: </label>
                {userEmailError && (
                  <span className="error-message">{userEmailError}</span>
                )}
                <input
                  type="email"
                  id="email"
                  value={userEmail}
                  className="text-input"
                  onChange={(event) => setUserEmail(event.target.value)}
                />

                {/* Password field */}
                <label htmlFor="password">Password: </label>
                {userPasswordError && (
                  <span className="error-message">{userPasswordError}</span>
                )}
                <div className="password-input">
                  <input
                    type={showPassword}
                    id="password"
                    value={userPassword}
                    className="icon-input"
                    onChange={(event) => setUserPassword(event.target.value)}
                  />
                  <img
                    src={passwordIcon}
                    className="eye-icon"
                    alt="gray eye with white pupil"
                    title={passwordIconTitle}
                    onClick={togglePassword}
                  />
                </div>

                {/* Location field */}
                <label htmlFor="location">Location: </label>
                {userLocationError && (
                  <span className="error-message">{userLocationError}</span>
                )}
                <select
                  className="text-input"
                  id="location"
                  value={userLocation}
                  onChange={(event) => setUserLocation(event.target.value)}
                >
                  <option value=""> </option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="USA">USA</option>
                </select>

                {/* Submit */}
                <button type="submit" className="exterior-main-button">
                  Create account
                </button>
              </form>
              <p className="guest-para-text">
                Already have an account?{" "}
                <Link to={"/"} className="accent-link">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
        <GradientContainer text="Welcome to our community" />
      </main>
      <ToastContainer transition={Flip} />
    </div>
  );
};

export default Signup;
