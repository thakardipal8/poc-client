import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import GradientContainer from "../../components/GradientContainer";
import showPasswordIcon from "../../assets/icons/eye.webp";
import hidePasswordIcon from "../../assets/icons/hide-eye.webp";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../App";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(showPasswordIcon);
  const [passwordIconTitle, setPasswordIconTitle] = useState("show password");
  const { setUserProfilePhoto } = useContext(UserContext);

  let navigate = useNavigate();

  // Toggles show/hide password
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

  // Validates form fields on form submit attempt
  const validateLoginForm = () => {
    if (!userEmail) {
      setEmailError("*required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userEmail)) {
      setEmailError("*please enter a valid email address");
    } else {
      setEmailError("");
    }

    if (!userPassword) {
      setPasswordError("*required");
    } else {
      setPasswordError("");
    }
  };

  // Handles form submission
  const handleLoginFormSubmit = (event) => {
    event.preventDefault();
    validateLoginForm();
    // ensures no errors, valid email and no blank fields prior to fetch
    if (!emailError && userEmail && !passwordError && userPassword) {
      fetch(`http://localhost:8080/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("userProfile", JSON.stringify(data));
          setUserProfilePhoto(data.profilePhoto);
          if (data.account === "contractor") {
            navigate("/contractor");
          }
          if (data.account === "admin" || data.account === "superAdmin") {
            navigate("/admin");
          }
          if (data.error) {
            toast.error(data.error, toastProps);
          }
        });
    }
  };

  return (
    <div className="guest-page-background">
      <main className="guest-page-content">
        <div className="guest-content-left">
          <div className="left-flex-content">
            <div className="guest-content-text">
              <h1 className="guest-page-heading">Sign in</h1>
              <p className="guest-para-text">Please enter your details.</p>
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
                <label htmlFor="password">Password: </label>
                {passwordError && (
                  <span className="error-message">{passwordError}</span>
                )}
                <div className="password-input">
                  <input
                    type={showPassword}
                    id="password"
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
                <button type="submit" className="exterior-main-button">
                  Log in
                </button>
              </form>
              <Link to={"/reset-password"} className="plain-text-link">
                Forgot Password?
              </Link>
              <p className="guest-para-text">
                Don't have an account?{" "}
                <Link to={"/signup"} className="accent-link">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
        <GradientContainer text="Welcome back" />
      </main>
      <ToastContainer transition={Flip} />
    </div>
  );
};

export default Login;
