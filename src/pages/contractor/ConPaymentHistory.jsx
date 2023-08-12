import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { tableTheme } from "../../data/materialTable/tableTheme";
import { conPaymentHistoryColumns } from "../../data/materialTable/materialTableColumns";
import { conPaymentHistoryOptions } from "../../data/materialTable/materialTableOptions";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const ConPaymentHistory = () => {
  const defaultMaterialTheme = createTheme(tableTheme);
  const navigate = useNavigate();

  // Sets navigate/url path then returns table columns.
  // This allows for column array to be defined outside of the component and still make use of useNavigate functionality.
  const tableColumns = conPaymentHistoryColumns(
    navigate,
    "/contractor/payment-detail"
  );

  // Sets the table row data received from the backend
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userId = userProfile.userId;

    // GETS all paid payments in db
    fetch(`${process.env.REACT_APP_API}/contractor/payments/${userId}/paid`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Data.message would only appear if there were 0 results, so forEach performed only if there are payments to display.
        // If there are no results, table will show "no records to display."
        if (!data.message) {
          data.forEach((item) => {
            item.payrollDate = item.payrollDate.slice(0, 10);
            item.displayPaymentId = item.paymentId.slice(0, 8);
          });
        }
        setTableData(data);
      })
      .catch((error) => {
        // If error, display a generic error alert to the user.
        toast.error("Error: Something went wrong!", toastProps);
      });
  }, []);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Payment History</h1>
      <div className="page-content">
        <div className="centered-text-heading">
          <h2 className="section-heading">View past and scheduled payments.</h2>
          <p className="para-text">
            Payments marked as in progress will be paid on the specified payroll
            date. Past payments are marked as paid.
          </p>
        </div>
        <div className="material-table-container">
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              columns={tableColumns}
              data={tableData}
              options={conPaymentHistoryOptions}
            />
          </ThemeProvider>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default ConPaymentHistory;
