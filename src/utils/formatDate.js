const formatDate = (dateObject) => {
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
};

export default formatDate;
