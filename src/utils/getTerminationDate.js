const setLastTimeOfDay = (date) => {
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  return date;
};

const getTerminationDateTime = () => {
  const currentDateTime = new Date();

  if (currentDateTime.getMonth() >= 2 && currentDateTime.getMonth() < 8) {
    currentDateTime.setMonth(11);
    currentDateTime.setDate(31);
    const terminationDateTime = setLastTimeOfDay(currentDateTime);

    return terminationDateTime;
  } else if (currentDateTime.getMonth() >= 8) {
    currentDateTime.setFullYear(currentDateTime.getFullYear() + 1);
    currentDateTime.setMonth(5);
    currentDateTime.setDate(30);
    const terminationDateTime = setLastTimeOfDay(currentDateTime);

    return terminationDateTime;
  } else if (
    currentDateTime.getMonth() === 0 ||
    currentDateTime.getMonth() === 1
  ) {
    currentDateTime.setMonth(5);
    currentDateTime.setDate(30);
    const terminationDateTime = setLastTimeOfDay(currentDateTime);

    return terminationDateTime;
  }
};

export const getFormattedTerminationDate = (
  date = getTerminationDateTime()
) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // Ensure month and day are two digits:
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
};
