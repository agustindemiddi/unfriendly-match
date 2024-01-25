export const getInputFormattedDate = (date) => {
  const year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let day = date.getUTCDate();
  // Ensure month and day are two digits:
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return `${year}-${month}-${day}`;
};

export const getInputFormattedTime = (date) => {
  const hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  // Ensure minutes is two digits:
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
};

// TournamentForm.jsx dates:

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

export const getInputFormattedTerminationDate = (
  date = getTerminationDate()
) => {
  return getInputFormattedDate(date);
};

export const getInputFormattedMaxTerminationDate = (date) => {
  const maxTerminationDate = new Date(date);
  maxTerminationDate.setUTCMonth(maxTerminationDate.getUTCMonth() + 18);
  return getInputFormattedTerminationDate(maxTerminationDate);
};

// MatchForm.jsx dates:

const currentDate = new Date();

const getDaysUntilNextMatch = (defaultMatchDay) =>
  (defaultMatchDay + 7 - currentDate.getUTCDay()) % 7;

export const getInputFormattedNextMatchDate = (defaultMatchDay) => {
  const daysUntilNextMatch = getDaysUntilNextMatch(defaultMatchDay);
  const nextMatchDate = new Date(currentDate);
  nextMatchDate.setUTCDate(nextMatchDate.getUTCDate() + daysUntilNextMatch);
  return getInputFormattedDate(nextMatchDate);
};

export const getInputFormattedNextMatchSubscriptionDate = (
  defaultMatchDay,
  defaultMatchSubscriptionDaysBefore
) => {
  const daysUntilNextMatch = getDaysUntilNextMatch(defaultMatchDay);
  const nextMatchSubscriptionDate = new Date(currentDate);
  nextMatchSubscriptionDate.setUTCDate(
    currentDate.getUTCDate() +
      daysUntilNextMatch -
      defaultMatchSubscriptionDaysBefore
  );
  return getInputFormattedDate(nextMatchSubscriptionDate);
};

// SoccerField date format:

export const getStringFormattedLongDateTime = (date) => {
  // console.log(date);
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
