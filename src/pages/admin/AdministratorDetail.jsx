import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import InfoBox from "../../components/infoDisplayBoxes/InfoBox";
import LargeInfoBox from "../../components/infoDisplayBoxes/LargeInfoBox";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const AdminConDetail = () => {
  const selectedAdmin = JSON.parse(localStorage.getItem("adminId"));
  const displayAdminId = selectedAdmin.slice(0, 10);

  const [dateJoined, setDateJoined] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [status, setStatus] = useState();
  const [accountType, setAccountType] = useState();

  // Manages if fields are in their editable form
  const [editStatus, setEditStatus] = useState(false);
  const [editAccountType, setEditAccountType] = useState(false);

  // Function takes in a state and its setState and updates a single field
  const updateFormField = (state, setState, updatedField, updatedValue) => {
    if (!state) {
      setState(true);
    } else {
      fetch(`${process.env.REACT_APP_API}/admin/update-user/${selectedAdmin}`, {
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
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Profile has been updated.", toastProps);
        })
        .catch((error) => {
          toast.error("Error: Something went wrong.", toastProps);
        });

      setState(false);
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/user-detail/${selectedAdmin}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setName(`${data[0].firstName} ${data[0].lastName}`);
        setDateJoined(data[0].dateJoined);
        setEmail(data[0].email);
        setStatus(data[0].status);
        setAccountType(data[0].accountType);
      })
      .catch((error) => {
        toast.error("Error: Something went wrong!", toastProps);
      });
  }, [selectedAdmin]);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Administrator Detail</h1>
      <div className="centered-text-heading">
        <h2 className="section-heading">{name}</h2>
        <p className="para-text">User Id: {displayAdminId}</p>
        <p className="para-text">Date Joined: {dateJoined}</p>
      </div>
      <div className="main-form">
        <div className="main-form-header">User Profile Details</div>
        <div className="top-form-container">
          {/* Name section */}
          <InfoBox title="Name:" content={name} className="form-item" />

          {/* Email section */}
          <InfoBox title="Email:" content={email} className="form-item" />

          {/* Status section */}
          <InfoBox title="Status:" content={status} className="form-item" />
        </div>
      </div>

      <div className="main-form">
        <div className="main-form-header">Account Settings</div>
        <div className="bottom-form-container">
          {/* Edits Status */}
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

          {/* Edits accountType permissions */}
          <LargeInfoBox
            className="form-item-large-outline"
            text={`This admin has the following permissions: `}
            content={`${accountType}`}
            label="Change account permissions to:"
            buttonText={editAccountType ? "Save" : "Edit"}
            edit={editAccountType}
            inputType="select"
            optionOne="admin"
            optionTwo="superAdmin"
            onChange={(event) => setAccountType(event.target.value)}
            onClick={() =>
              updateFormField(
                editAccountType,
                setEditAccountType,
                "accountType",
                accountType
              )
            }
          />
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AdminConDetail;
