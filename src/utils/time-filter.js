const moment = require("moment");

// Get date boundaries for yesterday
exports.dateBoundariesLastSevenDays = () => {
  let today = new Date();

  let startTime = new Date(today);
  startTime.setDate(startTime.getDate() - 7);
  startTime.setHours(0, 0, 0, 0);

  let endTime = new Date(today);
  endTime.setDate(endTime.getDate() + 1);
  endTime.setHours(0, 0, 0, 0);

  // >= for startTime
  // < for endTime
  return { startTime, endTime };
};

exports.dateBoundariesByLast30Days = () => {
  const month = new Date().getMonth();
  const startTime = moment("0101", "MMDD").add(month, "months").toDate();

  const endTime = moment("0101", "MMDD")
    .add(month + 1, "months")
    .toDate();

  // >= for startTime
  // < for endTime
  return { startTime, endTime };
};

// Get date boundaries between a date range
exports.dateBoundariesByDateRange = (fromDate, tillDate) => {
  let splittedStartDate = fromDate.split("-").reverse();
  let startTime = new Date(
    splittedStartDate[0],
    splittedStartDate[1] - 1,
    splittedStartDate[2]
  );

  let splittedEndDate = tillDate.split("-").reverse();
  let endTime = new Date(
    splittedEndDate[0],
    splittedEndDate[1] - 1,
    splittedEndDate[2]
  );

  endTime.setDate(endTime.getDate() + 1);
  return { startTime, endTime };
};
