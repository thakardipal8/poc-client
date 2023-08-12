// Contractor Column Options

// ConPendingPayments.jsx table options
export const conPendingPaymentColumns = (navigate, url) => {
  return [
    {
      title: "Status",
      field: "status",
      filterPlaceholder: "filter",
      lookup: { declined: "declined", pending: "pending" },
      cellStyle: { width: "`10%" },
      headerStyle: {
        width: "10%",
      },
      render: (row) => (
        <div
          style={{
            color: row.status === "declined" ? "#ff0000" : "#ff8000",
            cursor: "pointer",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
          onClick={() => {
            localStorage.setItem("paymentId", JSON.stringify(row.paymentId));
            navigate(url);
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      title: "Payment Date",
      field: "payrollDate",
      filterPlaceholder: "filter",
      defaultSort: "asc",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Hours",
      field: "hoursWorked",
      sorting: false,
      filterPlaceholder: "filter",
      cellStyle: { width: "10%" },
      headerStyle: { width: "10%" },
    },
    {
      title: "Submission Date",
      field: "requestDate",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Project",
      field: "projectName",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Program",
      field: "programName",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Description",
      field: "itemDescription",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
  ];
};

// ConPaymentHistory.jsx table options
export const conPaymentHistoryColumns = (navigate, url) => {
  return [
    {
      title: "Status",
      field: "status",
      filterPlaceholder: "filter",
      defaultSort: "asc",
      cellStyle: { width: "15%" },
      headerStyle: {
        width: "15%",
      },
      render: (row) => (
        <div
          style={{
            color: row.status === "in progress" ? "#53a006" : "#0967a6",
            cursor: "pointer",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
          onClick={() => {
            localStorage.setItem("paymentId", JSON.stringify(row.paymentId));
            navigate(url);
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      title: "Payment Date",
      field: "payrollDate",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Hours",
      field: "hoursWorked",
      sorting: false,
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Total Payment",
      field: "totalPayment",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
      type: "currency",
      align: "left",
    },
    {
      title: "Payment Type",
      field: "bonus",
      filterPlaceholder: "filter",
      lookup: { 0: "Payroll", 1: "Bonus" },
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      editable: false,
    },
    {
      title: "Payment Id",
      field: "displayPaymentId",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
  ];
};

// Admin Column Options

// AdminContractor.jsx columns
export const adminContractorColumns = (navigate, url) => {
  return [
    {
      title: "First Name",
      field: "firstName",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: {
        width: "15%",
      },
      render: (row) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.setItem("contractorId", JSON.stringify(row.userId));
            navigate(url);
          }}
        >
          {row.firstName}
        </div>
      ),
    },
    {
      title: "Last Name",
      field: "lastName",
      filterPlaceholder: "filter",
      defaultSort: "asc",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Company",
      field: "company",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      emptyValue: () => <span>n/a</span>,
    },
    {
      title: "Email",
      field: "email",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Location",
      field: "country",
      filterPlaceholder: "filter",
      lookup: { Canada: "Canada", Mexico: "Mexico", USA: "USA" },
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Status",
      field: "status",
      filterPlaceholder: "filter",
      lookup: { active: "active", inactive: "inactive" },
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      render: (row) => (
        <div
          style={{
            color: row.status === "active" ? "#53a006" : "#ff8000",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {row.status}
        </div>
      ),
    },
  ];
};

// AdminPendingPayments.jsx columns
export const adminPendingPaymentsColumns = (navigate, url) => {
  return [
    {
      title: "Status",
      field: "status",
      filtering: false,
      cellStyle: { width: "15%" },
      headerStyle: {
        width: "15%",
      },
      render: (row) => (
        <div
          style={{
            color: "#ff8000",
            cursor: "pointer",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
          onClick={() => {
            localStorage.setItem("paymentId", JSON.stringify(row.paymentId));
            navigate(url);
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      title: "Payment Date",
      field: "payrollDate",
      defaultSort: "asc",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Contractor Name",
      field: "firstName",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Contractor Email",
      field: "email",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Hours Worked",
      field: "hoursWorked",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      align: "center",
    },
    {
      title: "Payment Id",
      field: "displayPaymentId",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
  ];
};

// AdminScheduledPayments.jsx columns
export const adminScheduledPaymentColumns = (navigate, url) => {
  return [
    {
      title: "Status",
      field: "status",
      filtering: false,
      cellStyle: { width: "15%" },
      editable: false,
      headerStyle: {
        width: "15%",
      },
      render: (row) => (
        <div
          style={{
            color: "#53a006",
            cursor: "pointer",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
          onClick={() => {
            localStorage.setItem("paymentId", JSON.stringify(row.paymentId));
            navigate(url);
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      title: "Payment Date",
      field: "payrollDate",
      defaultSort: "asc",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Contractor Name",
      field: "firstName",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      editable: false,
    },
    {
      title: "Payment Amount",
      field: "totalPayment",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      type: "currency",
      align: "left",
      editable: false,
    },
    {
      title: "Currency",
      field: "currency",
      filterPlaceholder: "filter",
      lookup: { CAD: "CAD", MXN: "MXN", USD: "USD" },
      cellStyle: { width: "8%" },
      headerStyle: { width: "8%" },
      editable: false,
    },

    {
      title: "Payment Type",
      field: "bonus",
      filterPlaceholder: "filter",
      lookup: { 0: "Payroll", 1: "Bonus" },
      cellStyle: { width: "8%" },
      headerStyle: { width: "8%" },
      editable: false,
    },
    {
      title: "Payment Id",
      field: "displayPaymentId",
      filterPlaceholder: "filter",
      cellStyle: { width: "10%" },
      headerStyle: { width: "10%" },
      editable: false,
    },
  ];
};

// AdminPaymentHistory.jsx columns
export const adminPaymentHistoryColumns = (navigate, url) => {
  return [
    {
      title: "Status",
      field: "status",
      filtering: false,
      cellStyle: { width: "10%" },
      headerStyle: {
        width: "10%",
      },
      render: (row) => (
        <div
          style={{
            color: row.status === "in progress" ? "#53a006" : "#0967a6",
            cursor: "pointer",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
          onClick={() => {
            localStorage.setItem("paymentId", JSON.stringify(row.paymentId));
            navigate(url);
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      title: "Payment Date",
      field: "payrollDate",
      defaultSort: "asc",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Contractor Name",
      field: "firstName",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Contractor Email",
      field: "email",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
    {
      title: "Payment Amount",
      field: "totalPayment",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      type: "currency",
      align: "left",
    },
    {
      title: "Payment Type",
      field: "bonus",
      filterPlaceholder: "filter",
      lookup: { 0: "Payroll", 1: "Bonus" },
      cellStyle: { width: "8%" },
      headerStyle: { width: "8%" },
      editable: false,
    },
    {
      title: "Payment Id",
      field: "displayPaymentId",
      filterPlaceholder: "filter",
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
    },
  ];
};

// Administrators.jsx columns
export const adminAdministratorColumns = (navigate, url) => {
  return [
    {
      title: "First Name",
      field: "firstName",
      filterPlaceholder: "filter",
      cellStyle: { width: "20%" },
      headerStyle: {
        width: "20%",
      },
      render: (row) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.setItem("adminId", JSON.stringify(row.userId));
            navigate("/admin/administrator-detail");
          }}
        >
          {row.firstName}
        </div>
      ),
    },
    {
      title: "Last Name",
      field: "lastName",
      filterPlaceholder: "filter",
      defaultSort: "asc",
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Email",
      field: "email",
      filterPlaceholder: "filter",
      cellStyle: { width: "25%" },
      headerStyle: { width: "25%" },
    },
    {
      title: "Permissions",
      field: "accountType",
      filterPlaceholder: "filter",
      lookup: { admin: "admin", superAdmin: "superAdmin" },
      cellStyle: { width: "20%" },
      headerStyle: { width: "20%" },
    },
    {
      title: "Status",
      field: "status",
      filterPlaceholder: "filter",
      lookup: { active: "active", inactive: "inactive" },
      cellStyle: { width: "15%" },
      headerStyle: { width: "15%" },
      render: (row) => (
        <div
          style={{
            color: row.status === "active" ? "#53a006" : "#ff8000",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {row.status}
        </div>
      ),
    },
  ];
};
