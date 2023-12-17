const calculateCountdown = (registryDateTime) => {
  const currentDateTime = new Date();
  const timeDifference = registryDateTime - currentDateTime;

  if (timeDifference > 0) {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    let daysString = 'days';
    if (days === 1) daysString = 'day';

    const firstCountdownString = `${days} ${daysString}, ${hours}h ${minutes}m ${seconds}s`;
    // const firstCountdownString = `${days} ${daysString}, ${hours}h ${minutes}m`;

    let countdownString;
    if (days >= 1) {
      // countdownString = `${days} ${daysString}`;
      countdownString = firstCountdownString;
    } else {
      countdownString = firstCountdownString.slice(
        firstCountdownString.indexOf(',') + 2
      );
    }

    return countdownString;
  } else {
    return 'Match subscription already started';
  }
};

export default calculateCountdown;
