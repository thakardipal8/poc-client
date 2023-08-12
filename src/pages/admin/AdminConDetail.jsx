import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import UserDetailsDisplay from "../../components/UserDetailsDisplay";
import LargeInfoBox from "../../components/infoDisplayBoxes/LargeInfoBox";
import AddBonusPayment from "../../components/AddBonusPayment";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const AdminConDetail = () => {
  // Sets items from localStorage user profile upon first render
  const [dateJoined, setDateJoined] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [company, setCompany] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [baseComp, setBaseComp] = useState();
  const [currency, setCurrency] = useState();
  const [status, setStatus] = useState();
  const [bimonthlyRate, setBimonthlyRate] = useState();
  const [bimonthlyRateStartDate, setBimonthlyRateStartDate] = useState();

  // Manages if fields are in their editable form
  const [editCompensation, setEditCompensation] = useState(false);
  const [editCurrency, setEditCurrency] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [editBiMonthlyRate, setEditBiMonthlyRate] = useState(false);

  const selectedConsultant = JSON.parse(localStorage.getItem("contractorId"));
  const displayConsultantId = selectedConsultant.slice(0, 10);

  // Function takes in a state and its setState and updates a single field
  const updateFormField = (state, setState, updatedField, updatedValue) => {
    // if editable state is false, set to true on click
    if (!state) {
      setState(true);
    } else {
      // PATCH updated value
      fetch(
        `${process.env.REACT_APP_API}/admin/update-user/${selectedConsultant}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updatedFieldName: updatedField,
            updatedFieldValue: updatedValue,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Alert user if patch is successful
          toast.success("Profile has been updated.", toastProps);
        })
        .catch((error) => {
          // Alert user if patch is unsuccessful
          toast.error("Error: Something went wrong.", toastProps);
        });

      setState(false);
    }
  };

  useEffect(() => {
    // GETS user details for selected user
    fetch(
      `${process.env.REACT_APP_API}/admin/user-detail/${selectedConsultant}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setName(`${data[0].firstName} ${data[0].lastName}`);
        setDateJoined(data[0].dateJoined);
        setEmail(data[0].email);
        setCompany(data[0].company);
        setCity(data[0].city);
        setCountry(data[0].country);
        setPhone(data[0].phone);
        setCurrency(data[0].currency);
        setBaseComp(data[0].currentCompensation);
        setStatus(data[0].status);
        setBimonthlyRate(data[0].bimonthlyRate);
        if (data[0].bimonthlyRateStartDate !== null) {
          setBimonthlyRateStartDate(
            new Date(data[0].bimonthlyRateStartDate).toLocaleDateString()
          );
        }
      })
      .catch((error) => {
        toast.error("Error: Something went wrong!", toastProps);
      });
  }, [selectedConsultant]);

  const handleBiMonthlyRateSave = () => {
    updateFormField(
      editBiMonthlyRate,
      setEditBiMonthlyRate,
      "bimonthlyRate",
      bimonthlyRate
    );
    updateFormField(
      editBiMonthlyRate,
      setEditBiMonthlyRate,
      "bimonthlyRateStartDate",
      bimonthlyRateStartDate
    );
  };

  const getBiMonthlyRateStartDate = () => {
    if (bimonthlyRateStartDate) {
      console.log(bimonthlyRateStartDate);
      return new Date(bimonthlyRateStartDate).toISOString().substring(0, 10);
    }
    return new Date().toISOString().substring(0, 10);
  };

  return (
    <main className="page-layout">
      {/* Contractor Details section */}
      <h1 className="page-heading">Consultant Detail</h1>
      <div className="centered-text-heading">
        <h2 className="section-heading">{name}</h2>
        <p className="para-text">Consultant Id: {displayConsultantId}</p>
        <p className="para-text">Date Joined: {dateJoined}</p>
      </div>

      {/* User Details Section */}
      <UserDetailsDisplay
        name={name}
        company={company}
        email={email}
        city={city}
        country={country}
        phone={phone}
      />

      {/* Compensation section */}
      <div className="main-form">
        <div className="main-form-header">Compensation Settings</div>
        <div className="bottom-form-container">
          <LargeInfoBox
            className="form-item-large-outline"
            text={
              baseComp === null
                ? "IMPORTANT: Please set a base compensation for this user."
                : `Current base compensation is: $`
            }
            content={baseComp === null ? "" : `${baseComp}`}
            label="Change base compensation to: $"
            buttonText={editCompensation ? "Save" : "Edit"}
            edit={editCompensation}
            inputType="text"
            onChange={(event) => setBaseComp(event.target.value)}
            onClick={() =>
              updateFormField(
                editCompensation,
                setEditCompensation,
                "currentCompensation",
                baseComp
              )
            }
          />

          <LargeInfoBox
            className="form-item-large-outline"
            text={
              currency === null
                ? "IMPORTANT: Please set a preferred currency for this user."
                : `Preferred currency is set to: `
            }
            content={currency === null ? "" : currency}
            label="Change user's preferred currency to:"
            buttonText={editCurrency ? "Save" : "Edit"}
            edit={editCurrency}
            inputType="select"
            optionOne="MXN"
            optionTwo="CAD"
            optionThree="USD"
            onChange={(event) => setCurrency(event.target.value)}
            onClick={() =>
              updateFormField(
                editCurrency,
                setEditCurrency,
                "currency",
                currency
              )
            }
          />

          <div className="form-item-large-outline">
            <div className="form-row">
              {editBiMonthlyRate ? (
                <div className="form-column">
                  <div style={{ display: "table-row" }}>
                    <label className="bold-figure" htmlFor="bimonthlyrate">
                      {"Set Bi-Monthly Rate:"}
                    </label>
                    <input
                      type="text"
                      placeholder="Bi-Monthly Rate"
                      className="admin-input"
                      value={bimonthlyRate}
                      onChange={(event) => setBimonthlyRate(event.target.value)}
                      id="bimonthlyrate"
                    />
                  </div>
                  <div style={{ display: "table-row" }}>
                    <label
                      className="bold-figure"
                      htmlFor="bimonthlyrateStartdate"
                    >
                      {"Set Start Date:"}
                    </label>
                    <input
                      type="date"
                      value={getBiMonthlyRateStartDate()}
                      className="admin-input"
                      onChange={(event) =>
                        setBimonthlyRateStartDate(event.target.value)
                      }
                      id="bimonthlyrateStartdate"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="bold-figure">
                    {bimonthlyRate === null
                      ? "Set Bi-Monthly rate."
                      : `Bi-Monthly rate is set to: `}{" "}
                    <span className="bold-figure">{bimonthlyRate}</span>
                  </p>
                  <p className="bold-figure" style={{ marginLeft: "1rem" }}>
                    {bimonthlyRate === null
                      ? " Set Start Date."
                      : ` Start Date is set to: `}{" "}
                    <span className="bold-figure">
                      {bimonthlyRateStartDate}
                    </span>
                  </p>
                </>
              )}
            </div>
            <button
              className="yellow-link-button"
              onClick={handleBiMonthlyRateSave}
            >
              {editBiMonthlyRate ? "Save" : "Edit"}
            </button>
          </div>

          <AddBonusPayment baseComp={baseComp} currency={currency} />
        </div>
      </div>

      {/* Account Settings section */}
      <div className="main-form">
        <div className="main-form-header">Account Settings</div>
        <div className="bottom-form-container">
          <LargeInfoBox
            className="form-item-large-outline"
            text={`The status of this account is currently: `}
            content={`${status}`}
            label="Change account status to:"
            buttonText={editStatus ? "Save" : "Edit"}
            edit={editStatus}
            inputType="select"
            optionOne="inactive"
            optionTwo="active"
            optionThree=""
            onChange={(event) => setStatus(event.target.value)}
            onClick={() =>
              updateFormField(editStatus, setEditStatus, "status", status)
            }
          />
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AdminConDetail;
