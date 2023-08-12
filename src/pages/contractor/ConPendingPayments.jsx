import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { tableTheme } from "../../data/materialTable/tableTheme";
import { conPendingPaymentColumns } from "../../data/materialTable/materialTableColumns";
import { conPendingPaymentOptions } from "../../data/materialTable/materialTableOptions";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";

const ConPendingPayments = () => {
  const navigate = useNavigate();

  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const userId = userProfile.userId;

  // Sets the table theme
  const defaultMaterialTheme = createTheme(tableTheme);

  // Sets the navigate/url path and returns table columns.
  // This allows for column array to be defined outside of the component and still make use of useNavigate functionality.
  const tableColumns = conPendingPaymentColumns(
    navigate,
    "/contractor/payment-detail"
  );

  // Sets the table row data received from the backend
  const [tableData, setTableData] = useState([]);
  const [paymentId, setPaymentId] = useState();

  // Table CRUD operations
  // When user clicks on the delete icon, it will update table data and set Payment id.
  // The payment id being set triggers a DELETE request to the server.
  const editable = {
    onRowDelete: (selectedRow) =>
      new Promise((resolve, reject) => {
        setPaymentId(selectedRow.paymentId);
        const updatedData = [...tableData];
        updatedData.splice(selectedRow.tableData.id, 1);
        setTableData(updatedData);
        setTimeout(() => resolve(), 500);
      }),
  };

  useEffect(() => {
    // UseEffect GETS user's pending payments from the db
    fetch(
      `${process.env.REACT_APP_API}/contractor/payments/${userId}/pending`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Data.message would only appear if there were 0 results, so forEach performed only if there are payments to display.
        // If there are no results, table will show "no records to display."
        if (!data.message) {
          data.forEach((item) => {
            item.requestDate = item.requestDate.slice(0, 10);
            item.payrollDate = item.payrollDate.slice(0, 10);
            item.displayPaymentId = item.paymentId.slice(0, 8);
          });
          setTableData(data);
        }
      })
      .catch((error) => {
        // If error, display a generic error alert to the user.
        toast.error("Error: Something went wrong!", toastProps);
      });
  }, [userId]);

  useEffect(() => {
    // This UseEffect is triggered when the payment id is set by the user clicking the delete icon.
    if (paymentId) {
      fetch(
        `${process.env.REACT_APP_API}/contractor/delete-request/${paymentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Data.message will exist if delete was successful.
          if (data.message) {
            toast.success(data.message, toastProps);
          }
          // Set payment id back to empty
          setPaymentId();
        })
        .catch((error) => {
          // If error, display a generic error alert to the user.
          toast.error("Error: Something went wrong!", toastProps);
        });
    }
  });

  return (
    <main className="page-layout">
      <h1 className="page-heading">Pending Invoices</h1>
      <div className="page-content" style={{ width: "100%" }}>
        <div className="centered-text-heading">
          <h2 className="section-heading">
            Pending invoices are awaiting administrator review.
          </h2>
          <p className="para-text">
            Please click on an invoice below to see payment details. Declined
            invoices will include administrator feedback.
          </p>
        </div>
        <div className="material-table-container">
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              columns={tableColumns}
              data={tableData}
              editable={editable}
              options={conPendingPaymentOptions}
            />
          </ThemeProvider>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default ConPendingPayments;
