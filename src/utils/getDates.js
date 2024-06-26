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
  let hours = date.getHours();
  let minutes = date.getMinutes();
  // Ensure minutes is two digits:
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
};

// TournamentForm.jsx dates:

const getTerminationDate = () => {
  const terminationDate = new Date();
  const currentMonth = terminationDate.getMonth();
  if (currentMonth >= 2 && currentMonth < 8) {
    terminationDate.setMonth(11);
    terminationDate.setDate(31);
  } else {
    if (currentMonth >= 8)
      terminationDate.setFullYear(terminationDate.getFullYear() + 1);
    terminationDate.setMonth(5);
    terminationDate.setDate(30);
  }
  return terminationDate;
};

export const getInputFormattedTerminationDate = (
  date = getTerminationDate()
) => {
  return getInputFormattedDate(date);
};

export const getInputFormattedMaxTerminationDate = (date) => {
  const maxTerminationDate = new Date(date);
  maxTerminationDate.setMonth(maxTerminationDate.getMonth() + 18);
  return getInputFormattedTerminationDate(maxTerminationDate);
};

// MatchForm.jsx dates:

const currentDate = new Date();

const getDaysUntilNextMatch = (defaultMatchDay) =>
  (defaultMatchDay + 7 - currentDate.getDay()) % 7;

export const getInputFormattedNextMatchDate = (defaultMatchDay) => {
  const daysUntilNextMatch = getDaysUntilNextMatch(defaultMatchDay);
  const nextMatchDate = new Date(currentDate);
  nextMatchDate.setDate(nextMatchDate.getDate() + daysUntilNextMatch);
  return getInputFormattedDate(nextMatchDate);
};

export const getInputFormattedNextMatchSubscriptionDate = (
  defaultMatchDay,
  defaultMatchSubscriptionDaysBefore
) => {
  const daysUntilNextMatch = getDaysUntilNextMatch(defaultMatchDay);
  const nextMatchSubscriptionDate = new Date(currentDate);
  nextMatchSubscriptionDate.setDate(
    currentDate.getDate() +
      daysUntilNextMatch -
      defaultMatchSubscriptionDaysBefore
  );
  return getInputFormattedDate(nextMatchSubscriptionDate);
};

// SoccerField date format:

export const getStringFormattedLongDateTime = (date) => {
  const options = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('en-GB', options);
};

// AsideNavigationMatchItem.jsx date format:

export const getStringFormattedShortDate = (date) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  return date.toLocaleString('en-GB', options);
};
