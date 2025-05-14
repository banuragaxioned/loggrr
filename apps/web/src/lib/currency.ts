/**
 * Currency symbols map
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
};

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., "USD", "EUR")
 * @returns Formatted currency string (e.g., "$25.00", "€30.50")
 */
export function formatCurrency(amount: number | string, currency: string = "USD"): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  // Format with 2 decimal places
  const formattedAmount = numericAmount.toFixed(2);

  // Remove trailing zeros after decimal
  const cleanAmount = formattedAmount.replace(/\.?0+$/, "");

  return `${symbol}${cleanAmount}`;
}

/**
 * Parses a currency string into a number
 * @param input - Currency string (e.g., "$25", "€30.50")
 * @returns The numeric value
 */
export function parseCurrency(input: string): number {
  // Remove currency symbols and commas
  const cleanInput = input.replace(/[^0-9.-]/g, "");
  return parseFloat(cleanInput) || 0;
}
