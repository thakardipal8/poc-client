import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { tableTheme } from "../../data/materialTable/tableTheme";
import { adminContractorColumns } from "../../data/materialTable/materialTableColumns";
import { adminPendingPaymentsOptions } from "../../data/materialTable/materialTableOptions";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const AdminContractors = () => {
  const defaultMaterialTheme = createTheme(tableTheme);
  const navigate = useNavigate();

  // Sets navigate/url path then returns table columns.
  // This allows for column array to be defined outside of the component and still make use of useNavigate functionality.
  const tableColumns = adminContractorColumns(
    navigate,
    "/admin/contractor-detail"
  );

  // Sets the table row data received from the backend
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/users/contractor`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.company === "") {
            item.company = "n/a";
          }
        });
        setTableData(data);
      })
      .catch((error) => toast.error("Error: Something went wrong", toastProps));
  }, []);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Consultants</h1>
      <div className="page-content">
        <div className="centered-text-heading">
          <h2 className="section-heading">Manage consultants</h2>
          <p className="para-text">
            Select a user below to create a quarterly bonus payment, edit their
            compensation settings and account status.
          </p>
        </div>
        <div className="material-table-container">
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              columns={tableColumns}
              data={tableData}
              options={adminPendingPaymentsOptions}
            />
          </ThemeProvider>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AdminContractors;
