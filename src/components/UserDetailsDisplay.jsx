import React from "react";
import InfoBox from "./infoDisplayBoxes/InfoBox";

const UserDetailsDisplay = ({ name, email, company, country, city, phone }) => {
  return (
    <div className="main-form">
      <div className="main-form-header">Consultant Profile Details</div>
      <div className="top-form-container">
        <InfoBox title="Name:" content={name} className="form-item" />
        <InfoBox title="Company:" content={company} className="form-item" />
        <InfoBox title="Email:" content={email} className="form-item" />
      </div>
      <div className="top-form-container">
        <InfoBox title="City:" content={city} className="form-item" />
        <InfoBox title="Country:" content={country} className="form-item" />
        <InfoBox title="Phone:" content={phone} className="form-item" />
      </div>
    </div>
  );
};

export default UserDetailsDisplay;
