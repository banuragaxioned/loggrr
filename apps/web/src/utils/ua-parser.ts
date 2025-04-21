import { UAParser } from "ua-parser-js";

export function getDeviceName(userAgent: string | null | undefined): string {
  const { browser, os } = UAParser(userAgent ?? "Unknown device");

  if (!os.name && !browser.name) return "Unknown device";

  return `${os.name || ""} ${browser.name || ""} ${browser.version || ""}`.trim();
}
