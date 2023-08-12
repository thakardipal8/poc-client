import { useState, useEffect, Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import hamburger from "../assets/icons/hamburger.png";
import defaultUserImage from "../assets/icons/user-image.webp";
import { UserContext } from "../App";

const Header = ({ name, user, hamburgerControl }) => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const { userProfilePhoto } = useContext(UserContext);
  const userId = userProfile.userId;
  const [urlPath, setUrlPath] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [navVisible, setNavVisible] = useState(true);
  const [dropDownClass, setDropDownClass] = useState("dropdown-inactive");

  // Toggles visibility of dropdown menu on click
  const toggleDropDownMenu = () => {
    if (dropDownClass === "dropdown-active")
      setDropDownClass("dropdown-inactive");

    if (dropDownClass === "dropdown-inactive")
      setDropDownClass("dropdown-active");
  };

  // Toggles nav visibility on hamburger click
  const toggleNavOnHamburgerClick = () => {
    if (navVisible) {
      hamburgerControl(false);
      setNavVisible(false);
    } else {
      hamburgerControl(true);
      setNavVisible(true);
    }
  };

  const closeDropDownOnClick = () => {
    setDropDownClass("dropdown-inactive");
  };

  // Sets urlPath for dropdown depending on user props
  const setDropDownUrlPath = () => {
    if (user === "contractor") {
      setUrlPath("contractor");
    } else {
      localStorage.setItem("adminId", JSON.stringify(userId));
      setUrlPath("admin");
    }
  };

  useEffect(() => {
    setDropDownUrlPath();
  });

  useEffect(() => {
    if (userProfilePhoto) {
      setProfilePhoto(
        `${process.env.REACT_APP_API}/assets/${userProfilePhoto}`
      );
    } else if (userProfile.profilePhoto) {
      setProfilePhoto(
        `${process.env.REACT_APP_API}/assets/${userProfile.profilePhoto}`
      );
    } else {
      setProfilePhoto(defaultUserImage);
    }
  }, [userProfilePhoto, userProfile]);

  return (
    <header>
      <div className="header-background">
        <div className="header-left-content">
          <img
            src={hamburger}
            className="hamburger-icon"
            alt="PayMate logo"
            onClick={toggleNavOnHamburgerClick}
          />
          <span className="logo-text-large">Piece Of Cake</span>
        </div>
        <div className="header-right-content">
          <p className="welcome-user-text">Welcome back, {name}</p>
          <img
            src={profilePhoto}
            className="user-image"
            alt="gray circular background with a white stick figure shown from the waist up."
            onClick={toggleDropDownMenu}
          />
        </div>
      </div>
      <div className={dropDownClass}>
        <ul>
          {user !== "admin" ? (
            <Fragment>
              <li className="dropdown-item" onClick={closeDropDownOnClick}>
                <Link
                  to={
                    user === "contractor"
                      ? `/${urlPath}/profile`
                      : `/${urlPath}/administrator-detail`
                  }
                  className="dropdown-link"
                >
                  My Profile
                </Link>
              </li>
              <hr />
            </Fragment>
          ) : null}
          <li className="dropdown-item" onClick={closeDropDownOnClick}>
            <Link
              to="/"
              className="dropdown-link"
              onClick={() => localStorage.clear()}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
