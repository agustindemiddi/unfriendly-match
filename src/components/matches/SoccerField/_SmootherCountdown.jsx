import { useState, useEffect, useRef } from 'react';

import calculateCountdown from '../../../utils/calculateCountdownToMatchSubscription';

const SmootherMatchSubscriptionCountdown = ({ registryDateTime }) => {
  const [matchSubscriptionCountdown, setMatchSubscriptionCountdown] =
    useState('');
  const countdownRef = useRef();
  const updatedCountdownRef = useRef();
  const updatedCountdown = updatedCountdownRef.current;

  // set countdown to match date time subscription:
  const updateCountdown = () => {
    const newCountdownValue = calculateCountdown(registryDateTime);
    updatedCountdownRef.current = newCountdownValue;
    setMatchSubscriptionCountdown(newCountdownValue);
    countdownRef.current = requestAnimationFrame(updateCountdown);
  };

  useEffect(() => {
    countdownRef.current = requestAnimationFrame(updateCountdown);
    return () => cancelAnimationFrame(countdownRef.current);
  }, [registryDateTime]);

  return updatedCountdown;
};

export default SmootherMatchSubscriptionCountdown;
