const getTerminationDate = () => {
  const terminationDate = new Date();
  if (terminationDate.getMonth() >= 2 && terminationDate.getMonth() < 8) {
    terminationDate.setMonth(11);
    terminationDate.setDate(31);
  } else {
    if (terminationDate.getMonth() >= 8)
      terminationDate.setFullYear(terminationDate.getFullYear() + 1);
    terminationDate.setMonth(5);
    terminationDate.setDate(30);
  }

  return terminationDate;
};

export const getFormattedTerminationDate = (date = getTerminationDate()) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // Ensure month and day are two digits:
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
};

export const getFormattedMaxTerminationDate = (date) => {
  const maxTerminationDate = new Date(date);
  maxTerminationDate.setMonth(maxTerminationDate.getMonth() + 18);
  return getFormattedTerminationDate(maxTerminationDate);
};
