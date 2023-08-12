export const calculateDaysExcludingWeekends = (startDate, endDate) => {
  const currentDay = startDate;
  let numWeekdays = 0;
  [...new Float32Array(Math.abs(startDate - endDate) / 86400000 + 1)].forEach(
    () => {
      const dayOfWeek = currentDay.toDateString().slice(0, 3);
      if (dayOfWeek !== "Sat" && dayOfWeek !== "Sun") numWeekdays += 1;
      currentDay.setDate(currentDay.getDate() + 1);
    }
  );
  return numWeekdays;
};
