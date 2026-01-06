/**
 * Calculate Greatest Common Divisor (GCD)
 */
const gcd = (a, b) => {
  return b === 0 ? a : gcd(b, a % b);
};

/**
 * Calculate Least Common Multiple (LCM) of two numbers
 */
const lcmTwo = (a, b) => {
  return Math.abs(a * b) / gcd(a, b);
};

/**
 * Calculate Least Common Multiple (LCM) of an array of numbers
 */
const calculateLCM = (numbers) => {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Numbers must be a non-empty array');
  }
  
  if (numbers.some(n => !Number.isInteger(Number(n)) || Number(n) <= 0)) {
    throw new Error('All numbers must be positive integers');
  }
  
  const numArray = numbers.map(n => Number(n));
  
  if (numArray.length === 1) {
    return numArray[0];
  }
  
  let result = numArray[0];
  for (let i = 1; i < numArray.length; i++) {
    result = lcmTwo(result, numArray[i]);
  }
  
  return result;
};

/**
 * Add 1 to a number
 */
const addOne = (number) => {
  const num = Number(number);
  if (!Number.isInteger(num)) {
    throw new Error('Number must be an integer');
  }
  return num + 1;
};

module.exports = {
  calculateLCM,
  addOne,
  gcd,
  lcmTwo
};
