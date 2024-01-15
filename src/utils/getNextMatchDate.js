const getNextMatchDate = (selectedDayIndex) => {
  const today = new Date();
  const daysUntilNextMatch = (selectedDayIndex + 7 - today.getDay()) % 7;

  today.setDate(today.getDate() + daysUntilNextMatch);

  return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export default getNextMatchDate;
