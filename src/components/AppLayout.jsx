import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import headerBackground from "../assets/background/header-background.webp";

const AppLayout = () => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const userFirstName = userProfile.firstName;
  const userType = userProfile.account;

  const [navClassName, setNavClassName] = useState("app-layout-nav");

  const showHideNavBarOnHamburgerClick = (visibility) => {
    if (navClassName === "app-layout-nav") {
      setNavClassName("app-layout-hamburger");
    } else {
      setNavClassName("app-layout-nav");
    }
  };

  const closeNavbarOnHamburgerNavItemClick = () => {
    setNavClassName("app-layout-nav");
  };

  return (
    <div className="app-layout">
      <div
        className="app-layout-header"
        style={{
          backgroundImage: `url(${headerBackground})`,
        }}
      >
        <Header
          user={userType}
          name={userFirstName}
          hamburgerControl={showHideNavBarOnHamburgerClick}
        />
      </div>
      <div className="app-layout-body">
        <div className={navClassName}>
          <Navbar
            user={userType}
            hamburgerControl={closeNavbarOnHamburgerNavItemClick}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
