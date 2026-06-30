const LEGACY_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

/**
 * pg-connection-string v2 treats prefer/require/verify-ca as verify-full aliases.
 * Normalize explicitly to avoid the deprecation warning before pg v9.
 * @param {string} connectionString
 * @returns {string}
 */
export function normalizeDatabaseUrl(connectionString) {
  const url = new URL(connectionString);
  const sslmode = url.searchParams.get("sslmode");

  if (sslmode && LEGACY_SSL_MODES.has(sslmode)) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}
