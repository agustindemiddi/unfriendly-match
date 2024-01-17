export const getNextMatchDate = (selectedDayIndex) => {
  const today = new Date();
  const daysUntilNextMatch = (selectedDayIndex + 7 - today.getDay()) % 7;

  today.setDate(today.getDate() + daysUntilNextMatch);

  return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const getNextMatchSubscriptionDate = (matchDay, daysBeforeMatch) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysUntilMatch = (matchDay + 7 - today.getDay()) % 7;
  const subscriptionDate = new Date(today);

  subscriptionDate.setDate(today.getDate() + daysUntilMatch - daysBeforeMatch);

  // Handle the case where the subscriptionDate is from the previous month
  if (subscriptionDate.getMonth() !== currentMonth) {
    // Adjust for leap years
    const daysInPreviousMonth = new Date(
      currentYear,
      currentMonth,
      0
    ).getDate();

    subscriptionDate.setDate(
      daysInPreviousMonth - (daysBeforeMatch - subscriptionDate.getDate())
    );
  }

  return subscriptionDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};
