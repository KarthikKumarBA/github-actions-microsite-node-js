const { test, expect } = require("@playwright/test");

test("deployed microsite is healthy", async ({ page }) => {
  const url = process.env.DEPLOY_URL;

  if (!url) {
    throw new Error("DEPLOY_URL is required");
  }

  const response = await page.goto(url);

  expect(response.ok()).toBeTruthy();

  await expect(page).toHaveTitle(/GitHub Actions Microsite/i);

  await expect(
    page.getByRole("heading", { name: /GitHub Actions CI\/CD/i })
  ).toBeVisible();
});
