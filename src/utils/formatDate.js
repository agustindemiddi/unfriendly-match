const formatDate = (dateObject) => {
  if (dateObject && dateObject instanceof Date) {
    const options = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    return dateObject.toLocaleString('en-GB', options);
  } else {
    return 'Error fetching date and time!';
  }
};

export default formatDate;

export const asideNavFormatDate = (dateObject) => {
  if (dateObject && dateObject instanceof Date) {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    return dateObject.toLocaleString('en-GB', options);
  } else {
    return 'Error fetching date and time!';
  }
};
