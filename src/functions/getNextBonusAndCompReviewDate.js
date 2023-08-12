export const getNextBonusAndCompReviewDate = () => {
  let currentDate = new Date();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  if (month <= 3) currentDate.setMonth(4);
  else if (month <= 6) currentDate.setMonth(7);
  else if (month <= 9) currentDate.setMonth(10);
  else {
    currentDate.setMonth(1);
    currentDate.setFullYear(year + 1);
  }
  // Add a leading zero if month < 10
  return currentDate.getMonth() < 10
    ? `${currentDate.getFullYear()}-0${currentDate.getMonth()}-15`
    : `${currentDate.getFullYear()}-${currentDate.getMonth()}-15`;
};
