import { test, expect } from "@playwright/test";

test("Page sections", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Loggr - Time tracking made simple");
  await expect(page.getByRole("link", { name: "Loggr" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" }).first()).toBeVisible();
  await expect(page.getByLabel("Toggle theme").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Join the waitlist" })).toBeVisible();
  await expect(page.getByPlaceholder("hello@me.com")).toBeVisible();
  await expect(page.getByRole("button", { name: "Notify" })).toBeVisible();
  await expect(page.getByText(/Axioned/)).toBeVisible();
});
