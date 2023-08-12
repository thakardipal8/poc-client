export const getLastBonusDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // add a leading zero to the month/day if needed
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;

  const currentDate = `${month}-${day}`;
  const quarterOne = "04-15";
  const quarterTwo = "07-15";
  const quarterThree = "10-15";
  const quarterFour = "01-15";

  if (currentDate < quarterFour) return `${year - 1}-${quarterThree}`;

  if (currentDate > quarterFour && currentDate < quarterOne)
    return `${year}-${quarterFour}`;

  if (currentDate > quarterOne && currentDate < quarterTwo)
    return `${year}-${quarterOne}`;

  if (currentDate > quarterTwo && currentDate < quarterThree)
    return `${year}-${quarterTwo}`;

  if (currentDate > quarterThree && currentDate < "12-31")
    return `${year}-${quarterThree}`;
};
