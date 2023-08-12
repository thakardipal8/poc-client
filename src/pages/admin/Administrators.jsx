import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { tableTheme } from "../../data/materialTable/tableTheme";
import { adminAdministratorColumns } from "../../data/materialTable/materialTableColumns";
import { adminAdministratorOptions } from "../../data/materialTable/materialTableOptions";
import plusIcon from "../../assets/icons/plus-icon.webp";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const Administrators = () => {
  const defaultMaterialTheme = createTheme(tableTheme);
  const navigate = useNavigate();

  // Sets navigate/url path then returns table columns.
  // This allows for column array to be defined outside of the component and still make use of useNavigate functionality.
  const tableColumns = adminAdministratorColumns(
    navigate,
    "/admin/administrator-detail"
  );

  // Sets the table row data received from the backend
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/users/admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Data.message only exists if no records found.
        if (!data.message) {
          setTableData(data);
        }
      })
      .catch((error) => {
        toast.error("Error: Something went wrong.", toastProps);
      });
  }, []);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Administrators</h1>
      <div className="page-content">
        <div className="centered-text-heading">
          <h2 className="section-heading">
            Manage your organization's administrators
          </h2>
          <p className="para-text">
            Select a user below to edit their permissions and account status.
          </p>
          <div className="centered-div-with-margin">
            <button
              className="interior-black-button"
              onClick={() => navigate("/admin/add-administrator")}
            >
              <img
                src={plusIcon}
                className="button-icon"
                alt="white plus sign"
              />
              Add a new Admin
            </button>
          </div>
        </div>
        <div className="material-table-container">
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              columns={tableColumns}
              data={tableData}
              options={adminAdministratorOptions}
            />
          </ThemeProvider>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default Administrators;
