import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import ProfileItem from "../../components/ProfileItem";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";
import defaultUserImage from "../../assets/icons/large-user-icon.webp";
import userLocationIcon from "../../assets/icons/location-icon.webp";
import dateJoinedIcon from "../../assets/icons/date-joined-icon.png";
import nameIcon from "../../assets/icons/name-icon.png";
import emailIcon from "../../assets/icons/email-icon.png";
import lockIcon from "../../assets/icons/lock-icon.png";
import companyIcon from "../../assets/icons/company-icon.png";
import phoneIcon from "../../assets/icons/phone-icon.png";
import { UserContext } from "../../App";

const ConProfile = () => {
  const { userProfilePhoto, setUserProfilePhoto } = useContext(UserContext);
  // Sets fields that were stored in local storage upon login
  let userProfile = JSON.parse(localStorage.getItem("userProfile"));
  let userId = userProfile.userId;
  let firstName = userProfile.firstName;
  let accountType = userProfile.account;

  // Manages if fields are in editable state or text state
  const [editableFields, setEditableFields] = useState(false);

  // Changes fields to editable state when 'edit profile' is clicked
  const editProfileFields = () => {
    if (editableFields === false) {
      setEditableFields(true);
    }
  };

  // Non-editable profile fields
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [lastName, setLastName] = useState("not provided");
  const [baseComp, setBaseComp] = useState(null);
  const [compReviewDate, setCompReviewDate] = useState("");

  // Manages changes to editable profile fields
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [currency, setCurrency] = useState("not provided");
  const [company, setCompany] = useState("not provided");
  const [city, setCity] = useState("Toronto");
  const [country, setCountry] = useState("Canada");
  const [phoneNumber, setPhoneNumber] = useState("not provided");

  // Manages errors on mandatory fields that are editable
  const [emailError, setEmailError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Validates required editable fields (email and country)
  const validateProfileInfo = () => {
    if (!email) {
      setEmailError("*required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailError("*please enter a valid email address");
    } else {
      setEmailError("");
    }

    if (!country) {
      setCountryError("*required");
    } else {
      setCountryError("");
    }
  };

  // Updates profile info to the db and changes fields back to text state when 'save' is clicked
  const saveProfileFields = (e) => {
    e.preventDefault();
    validateProfileInfo();

    // Ensures fields are populated and email is valid address
    if (email && country && !emailError) {
      setEditableFields(false);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("phone", phoneNumber);
      formData.append("currency", currency);
      formData.append("company", company);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("profilePhoto", profilePhoto);
      fetch(
        `${process.env.REACT_APP_API}/contractor/update-profile/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
            Accept: "multipart/form-data",
          },
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          toast.success("Profile has been updated.", toastProps);
          userProfile.currency = currency;
          userProfile.profilePhoto = profilePhoto.name;
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
          if (profilePhoto !== null) {
            setUserProfilePhoto(profilePhoto.name);
            setProfileImage(
              `${process.env.REACT_APP_API}/assets/${profilePhoto.name}`
            );
          }
          if (data.error) {
            toast.error(data.error, toastProps);
          }
        });
    }
  };

  const determineNextCompReviewDate = () => {
    const todaysDate = new Date();
    let month = todaysDate.getMonth() + 1;
    let year = todaysDate.getFullYear();

    if (month < 4) {
      setCompReviewDate(`April ${year}`);
    }

    if (month > 4 && month <= 6) {
      setCompReviewDate(`July ${year}`);
    }

    if (month > 7 && month <= 9) {
      setCompReviewDate(`October ${year}`);
    }

    if (month > 10 && month <= 12) {
      setCompReviewDate(`January ${year + 1}`);
    }
  };

  useEffect(() => {
    // Fetch upon render to set user profile fields
    fetch(`${process.env.REACT_APP_API}/profile/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          toast.error("An error occurred. User not found.", toastProps);
        } else {
          setUsername(data[0].userName);
          setDateOfBirth(new Date(data[0].dateOfBirth).toDateString());
          setDateJoined(data[0].dateJoined);
          setLastName(data[0].lastName);
          setEmail(data[0].email);
          setCountry(data[0].country);

          if (data[0].currentCompensation !== null) {
            setBaseComp(data[0].currentCompensation);
          }

          if (data[0].phone !== null) {
            setPhoneNumber(data[0].phone);
          }

          if (data[0].company !== null) {
            setCompany(data[0].company);
          }

          if (data[0].city !== null) {
            setCity(data[0].city);
          }

          if (data[0].profilePhoto !== null) {
            setProfileImage(
              `${process.env.REACT_APP_API}/assets/${data[0].profilePhoto}`
            );
          } else if (userProfilePhoto) {
            setProfileImage(
              `${process.env.REACT_APP_API}/assets/${data[0].userProfilePhoto}`
            );
          } else {
            setProfileImage(defaultUserImage);
          }

          if (data[0].currency === null) {
            setCurrency("*REQUIRED: Please set your preferred currency.");
          } else {
            setCurrency(data[0].currency);
          }
          if (data.error) {
            console.log(data.error);
            toast.error(data.error, toastProps);
          }
        }
      })
      .catch((error) => {
        toast.error("Error: Something went wrong!", toastProps);
      });

    determineNextCompReviewDate();
  }, [userId, userProfilePhoto]);

  return (
    <main className="page-layout">
      <h1 className="page-heading">My Profile</h1>
      <div className="page-content">
        <form onSubmit={saveProfileFields}>
          {/* Top profile section with name and photo */}
          <div className="profile-top-section">
            <img
              src={profileImage}
              className="large-user-image"
              alt="gray circular background with a white stick figure shown from the waist up."
            />
            <h2 className="profile-name-heading">
              {firstName} {lastName}
            </h2>
          </div>
          {baseComp !== null ? (
            <div className="form-item-large-outline-center">
              <p className="plain-text-heading">
                Your current base compensation rate of ${baseComp} will be
                eligible for review {compReviewDate}.
              </p>
            </div>
          ) : null}
          {!editableFields && (
            <p className="underlined-link" onClick={editProfileFields}>
              Edit profile
            </p>
          )}

          {/* Bottom profile section with info fields */}
          <div className="profile-bottom-section">
            <div className="profile-bottom-left">
              {/* username field */}
              <ProfileItem
                icon={nameIcon}
                alt="Black circle with a white star"
                heading="Username:"
                content={username}
                edit={false}
              />
              {/* Date joined field */}
              <ProfileItem
                icon={dateJoinedIcon}
                alt="Black circle with a white star"
                heading="Date Joined:"
                content={dateJoined}
                edit={false}
              />
              {/* First name field */}
              <ProfileItem
                icon={nameIcon}
                alt="Black circle with a white stick figure shown from the waist up"
                heading="First Name:"
                content={firstName}
                edit={false}
              />

              {/* Last name field */}
              <ProfileItem
                icon={nameIcon}
                alt="User Icon"
                heading="Last Name:"
                content={lastName}
                edit={false}
              />

              {/* Email field */}
              <ProfileItem
                icon={emailIcon}
                alt="Black circle with a white envelope"
                heading="Email:"
                content={email}
                edit={editableFields}
                error={emailError}
                onChange={(event) => setEmail(event.target.value)}
              />

              {/* Phone field */}
              <ProfileItem
                icon={phoneIcon}
                alt="Black circle with a white phone receiver"
                heading="Phone Number (optional):"
                content={phoneNumber}
                edit={editableFields}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />

              {/* Profile Picture field*/}
              {editableFields && (
                <div className="profile-item">
                  <img src={nameIcon} alt="Black circle with a white padlock" />
                  <div className="profile-item-text">
                    <h3 className="plain-text-heading">Profile Picture:</h3>

                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept="image/png, image/jpeg"
                      multiple={false}
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="profile-bottom-right">
              {/* Date of birth field */}
              <ProfileItem
                icon={lockIcon}
                alt="Black circle with a white star"
                heading="Date of Birth:"
                content={dateOfBirth}
                edit={false}
              />
              {/* Account type field */}
              <ProfileItem
                icon={lockIcon}
                alt="Black circle with a white padlock"
                heading="Account Type:"
                content={accountType}
                edit={false}
              />

              {/* Currency type field */}
              <div className="profile-item">
                <img src={lockIcon} alt="Black circle with a white padlock" />
                <div className="profile-item-text">
                  <h3 className="plain-text-heading">Preferred Currency:</h3>

                  {editableFields === false ? (
                    <p className="para-text">{currency}</p>
                  ) : (
                    <select
                      className="text-input"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                    >
                      <option value=""> </option>
                      <option value="CAD">$ CAD</option>
                      <option value="MXN">$ MXN</option>
                      <option value="USD">$ USD</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Company field */}
              <ProfileItem
                icon={companyIcon}
                alt="Black circle with a white commercial building"
                heading="Company (optional):"
                content={company}
                edit={editableFields}
                onChange={(event) => setCompany(event.target.value)}
              />

              {/* City field */}
              <ProfileItem
                icon={userLocationIcon}
                alt="Black circle with a white location pin"
                heading="City (optional):"
                content={city}
                edit={editableFields}
                onChange={(event) => setCity(event.target.value)}
              />

              {/* Country field */}
              <ProfileItem
                icon={userLocationIcon}
                alt="Black circle with a white location pin"
                heading="Country:"
                content={country}
                edit={editableFields}
                error={countryError}
                onChange={(event) => setCountry(event.target.value)}
              />
            </div>
          </div>

          <div>
            {editableFields === true ? (
              <>
                <button
                  className="interior-blue-button"
                  onClick={() => setEditableFields(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="interior-black-button">
                  Save changes
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default ConProfile;
