// <<< NOT WORKING >>> setMatchRegistryCountdown is not a function ???
// const calculateCountdownToMatch = (
//   subscriptionDateTime,
//   setMatchSubscriptionCountdown
// ) => {
//   const currentDateTime = new Date();
//   const timeDifference = subscriptionDateTime - currentDateTime;

//   if (timeDifference > 0) {
//     // const seconds = Math.floor((timeDifference / 1000) % 60);
//     const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
//     const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
//     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//     setMatchSubscriptionCountdown(`${days}d ${hours}h ${minutes}m`);
//   } else {
//     setMatchSubscriptionCountdown('Match subscription already started');
//   }
// };

// export default calculateCountdownToMatch;

// <<< NOT WORKING >>> setMatchRegistryCountdown is not a function ???
const calculateCountdown = (registryDateTime, setMatchRegistryCountdown) => {
  const currentDateTime = new Date();
  const timeDifference = registryDateTime - currentDateTime;

  if (timeDifference > 0) {
    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    setMatchRegistryCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  } else {
    setMatchRegistryCountdown('Match registry already started');
  }
};

export default calculateCountdown;
