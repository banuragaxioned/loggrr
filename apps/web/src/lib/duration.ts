/**
 * Parses various duration formats into minutes
 * @param input - Duration in formats like "1.5", "1:30", ":30", "1", "0.2"
 * @returns Duration in minutes
 */
export function parseDurationToMinutes(input: string): number {
  // Handle empty input
  if (!input) return 0;

  // Handle decimal format (e.g., "1.5")
  if (input.includes(".")) {
    const hours = parseFloat(input);
    return Math.round(hours * 60);
  }

  // Handle time format (e.g., "1:30", ":30")
  if (input.includes(":")) {
    const [hours = "0", minutes = "0"] = input.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  // Handle single number (e.g., "1", "0.2")
  const value = parseFloat(input);
  return Math.round(value * 60);
}

/**
 * Formats minutes into hours with decimal
 * @param minutes - Duration in minutes
 * @returns Formatted duration in hours (e.g., "1", "1.5", "1.75")
 */
export function formatMinutesToHours(minutes: number): string {
  const hours = minutes / 60;

  // If it's a whole number, return without decimal
  if (Number.isInteger(hours)) return hours.toString();

  // For common fractions, use exact decimals
  const remainder = hours % 1;
  if (remainder === 0.25) return hours.toFixed(2);
  if (remainder === 0.5) return hours.toFixed(1);
  if (remainder === 0.75) return hours.toFixed(2);

  // For other decimals, round to 1 decimal place
  return hours.toFixed(1);
}

/**
 * Formats minutes into hours and minutes
 * @param minutes - Duration in minutes
 * @returns Formatted duration (e.g., "1h 30m")
 */
export function formatMinutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}
