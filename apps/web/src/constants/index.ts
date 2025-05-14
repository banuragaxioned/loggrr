export const NON_ORGANIZATION_PATHS = ["dashboard", "settings", "profile", "welcome", "thanks"];

export const CURRENCIES = ["USD", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = CURRENCIES.map((currency) => ({
  value: currency,
  label: currency,
}));
