export const getLastPayrollDate = () => {
  let payrollDate = new Date();
  payrollDate.setDate(payrollDate.getDate() >= 15 ? 15 : 0);
  let payrollMonth = payrollDate.getMonth() + 1;

  if (payrollMonth < 10) payrollMonth = `0${payrollMonth}`;
  return `${payrollDate.getFullYear()}-${payrollMonth}-${payrollDate.getDate()}`;
};
