const getTerminationDate = () => {
  const terminationDate = new Date();
  const currentMonth = terminationDate.getUTCMonth();
  if (currentMonth >= 2 && currentMonth < 8) {
    terminationDate.setUTCMonth(11);
    terminationDate.setUTCDate(31);
  } else {
    if (currentMonth >= 8)
      terminationDate.setUTCFullYear(terminationDate.getUTCFullYear() + 1);
    terminationDate.setUTCMonth(5);
    terminationDate.setUTCDate(30);
  }
  return terminationDate;
};

export const getInputFormattedDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // Ensure month and day are two digits:
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return `${year}-${month}-${day}`;
};

export const getInputFormattedTime = (date) => {
  const hours = date.getHours();
  let minutes = date.getMinutes();
  // Ensure minutes is two digits:
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
};

export const getFormattedTerminationDate = (date = getTerminationDate()) => {
  return getInputFormattedDate(date);
};

export const getFormattedMaxTerminationDate = (date) => {
  const maxTerminationDate = new Date(date);
  maxTerminationDate.setMonth(maxTerminationDate.getMonth() + 18);
  return getFormattedTerminationDate(maxTerminationDate);
};
