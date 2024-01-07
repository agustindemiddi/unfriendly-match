function calculateTerminationDate() {
  const numberOfMonths = 6;
  const currentDate = new Date();

  // Calculate termination date by adding X months
  const terminationDate = new Date(currentDate);
  terminationDate.setMonth(terminationDate.getMonth() + numberOfMonths);

  return terminationDate;
}

// Example usage:
const terminationDate = calculateTerminationDate();
console.log('Current Date:', new Date().toISOString().split('T')[0]);
console.log('Termination Date:', terminationDate.toISOString().split('T')[0]);
