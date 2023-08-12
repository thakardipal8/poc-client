import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast, Flip } from "react-toastify";
import { toastProps } from "../../data/toastProps/toastProps";
import { tableTheme } from "../../data/materialTable/tableTheme";
import { adminScheduledPaymentColumns } from "../../data/materialTable/materialTableColumns";
import { adminScheduledPaymentOptions } from "../../data/materialTable/materialTableOptions";
import { parseTokenFromLocalStorage } from "../../functions/parseTokenFromLocalStorage";
import checkmark from "../../assets/icons/checkmark.png";

const AdminScheduledPayments = () => {
  const defaultMaterialTheme = createTheme(tableTheme);
  const navigate = useNavigate();

  // Sets navigate/url path then returns table columns.
  // This allows for column array to be defined outside of the component and still make use of useNavigate functionality.
  const tableColumns = adminScheduledPaymentColumns(
    navigate,
    "/admin/payment-detail"
  );

  // Sets the table row data received from the backend
  const [tableData, setTableData] = useState([]);
  const [paymentId, setPaymentId] = useState();
  const [updatedField, setUpdatedField] = useState();
  const [updatedValue, setUpdatedValue] = useState();

  const editable = {
    onRowUpdate: (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const updatedData = [...tableData];
        updatedData[oldRow.tableData.id] = newRow;
        setTableData(updatedData);
        setPaymentId(newRow.paymentId);
        setUpdatedField("payrollDate");
        setUpdatedValue(newRow.payrollDate);
        setTimeout(() => resolve(), 500);
      }),
  };

  const actions = [
    {
      icon: () => (
        <img
          src={checkmark}
          alt="blue circle with white checkmark in center."
        />
      ),
      tooltip: "Mark as paid",
      onClick: (event, selectedRow) =>
        new Promise((resolve, reject) => {
          setPaymentId(selectedRow.paymentId);
          const updatedData = [...tableData];
          updatedData.splice(selectedRow.tableData.id, 1);
          setTableData(updatedData);
          setUpdatedField("status");
          setUpdatedValue("paid");
          setTimeout(() => resolve(), 500);
        }),
    },
  ];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admin/all-payments/progress`, {
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
      })
      .catch((error) => {
        toast.error("Error: Something went wrong!", toastProps);
      });
  }, []);

  useEffect(() => {
    if (paymentId) {
      fetch(`http://localhost:8080/admin/update-payment/${paymentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${parseTokenFromLocalStorage()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updatedField: updatedField,
          updatedValue: updatedValue,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Payment has been updated", toastProps);
        })
        .catch((error) => {
          toast.error("Error: Something went wrong.", toastProps);
        });
    }
  });

  return (
    <main className="page-layout">
      <h1 className="page-heading">Scheduled Payments</h1>
      <div className="page-content">
        <div className="centered-text-heading">
          <h2 className="section-heading">Manage scheduled payments</h2>
          <p className="para-text">
            Select a payment below to mark as paid. Once paid, payments can be
            accessed from the Past Payments page.
          </p>
        </div>
        <div className="material-table-container">
          <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
              columns={tableColumns}
              data={tableData}
              options={adminScheduledPaymentOptions}
              editable={editable}
              actions={actions}
            />
          </ThemeProvider>
        </div>
      </div>
      <ToastContainer transition={Flip} />
    </main>
  );
};

export default AdminScheduledPayments;
