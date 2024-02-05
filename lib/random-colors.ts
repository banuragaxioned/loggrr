// Function to pad a string with leading zeros to ensure it has at least 2 characters
const padWithZeros = (str: string) => {
  return str.length < 2 ? `0${str}` : str;
};

const customRandom = (seed: number) => {
  let state = seed;
  return () => {
    // Initialize a custom pseudo-random number generator
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

// Function to get random dark colors
export const getRandomColor = (index: number) => {
  // Define the maximum value for each color component (0-255)
  const maxColorValue = 255;

  // Create a deterministic seed based on the index
  const seed = index * 9973; // You can choose any prime number as the multiplier

  // Use the seed to initialize a custom pseudo-random number generator
  const rng = customRandom(seed);

  // Generate random values for red, green, and blue components
  const red = Math.floor(rng() * maxColorValue * 0.5); // Limit red to 0-127
  const green = Math.floor(rng() * maxColorValue * 0.5); // Limit green to 0-127
  const blue = Math.floor(rng() * maxColorValue * 0.5); // Limit blue to 0-127

  // Convert the RGB components to a hexadecimal color representation with leading zeros
  const darkColor = `#${padWithZeros(red.toString(16))}${padWithZeros(
    green.toString(16),
  )}${padWithZeros(blue.toString(16))}`;

  return darkColor;
};
