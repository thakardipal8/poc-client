import React from "react";
import { useNavigate } from "react-router-dom";
import arrowIcon from "../../assets/icons/arrow-icon.webp";

const PaymentStatusCount = ({
  icon,
  iconAltText,
  heading,
  url,
  content,
  type,
}) => {
  const navigate = useNavigate();
  return (
    <div className="overview-icon-section">
      <div>
        <img src={icon} className="info-icon" alt={iconAltText} />
      </div>
      <div className="overview-text-section">
        <h2 className="section-heading-overview">{heading}</h2>
        <p className="para-text">
          You have{" "}
          <span className="bold-text" onClick={() => navigate(url)}>
            {content}
          </span>{" "}
          {type}.
        </p>
      </div>
      <img
        src={arrowIcon}
        className="arrow-icon"
        alt="black circle with white arrow pointing to the right"
        title="view declined payments"
        onClick={() => navigate(url)}
      />
    </div>
  );
};

export default PaymentStatusCount;
