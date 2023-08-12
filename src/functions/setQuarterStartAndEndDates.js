export const setQuarterStartAndEndDates = (
  quarter,
  setStartDate,
  setEndDate,
  setPayrollDate
) => {
  const currentYear = new Date().getFullYear();

  if (quarter === "Q1") {
    setStartDate(`${currentYear}-01-01`);
    setEndDate(`${currentYear}-03-31`);
    setPayrollDate(`${currentYear}-04-15`);
  }

  if (quarter === "Q2") {
    setStartDate(`${currentYear}-04-01`);
    setEndDate(`${currentYear}-06-30`);
    setPayrollDate(`${currentYear}-07-15`);
  }

  if (quarter === "Q3") {
    setStartDate(`${currentYear}-07-01`);
    setEndDate(`${currentYear}-09-30`);
    setPayrollDate(`${currentYear}-10-15`);
  }

  if (quarter === "Q4") {
    setStartDate(`${currentYear - 1}-10-01`);
    setEndDate(`${currentYear - 1}-12-31`);
    setPayrollDate(`${currentYear + 1}-01-15`);
  }
};
