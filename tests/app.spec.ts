import { expect, test } from "@playwright/test";

test("shows home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Sketched/);
});
