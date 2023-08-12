import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { tableTheme } from "../../data/materialTable/tableTheme";
import { adminPaymentHistoryColumns } from "../../data/materialTable/materialTableColumns";
import { adminPaymentHistoryOptions } from "../../data/materialTable/materialTableOptions";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const AdminPaymentHistory = () => {
  const defaultMaterialTheme = createTheme(tableTheme);
  const navigate = useNavigate();

  // Sets navigate/url path then returns table columns.
  // This allows for column array to be defined outside of the component and still make use of useNavigate functionality.
  let tableColumns = adminPaymentHistoryColumns(
    navigate,
    "/admin/payment-detail"
  );

  // Sets the table row data received from the backend
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/all-payments/paid`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          // formats date to YYYY-MM-DD
          item.payrollDate = item.payrollDate.slice(0, 10);
          // slices uuid4 to the first 7 digits for display purposes only. Full id in tact in db.
          item.displayPaymentId = item.paymentId.slice(0, 8);
          // combines first and last names to one column
          item.firstName = `${item.firstName} ${item.lastName}`;
        });
        setTableData(data);

        if (data.error) {
          toast.error(data.error, toastProps);
        }
      })
      .catch((error) => {
        toast.error("Error: Something went wrong!", toastProps);
      });
  }, []);

  return (
    <main className="page-layout">
      <h1 className="page-heading">Payment History</h1>
      <div className="page-content">
        <div className="centered-text-heading">
          <h2 className="section-heading">View past payments.</h2>
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
              options={adminPaymentHistoryOptions}
            />
          </ThemeProvider>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AdminPaymentHistory;
