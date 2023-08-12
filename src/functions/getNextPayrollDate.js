export const getNextPayrollDate = () => {
  let payrollDate = new Date();
  if (payrollDate.getDate() >= 15) payrollDate.setDate(0);
  if (payrollDate.getDate() < 15) payrollDate.setDate(15);
  let payrollMonth = payrollDate.getMonth() + 1;
  return payrollMonth < 10
    ? `${payrollDate.getFullYear()}-0${payrollMonth}-${payrollDate.getDate()}`
    : `${payrollDate.getFullYear()}-${payrollMonth}-${payrollDate.getDate()}`;
};
