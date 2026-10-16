import { test, expect } from '@playwright/test';

test.use({
  storageState: { cookies: [], origins: [] },
});

const account = {
  name: 'Playwright User One',
  email: 'playwright.user.one@example.com',
  password: 'Playwright@123',
};

test(
  '@smoke auth login with valid credentials',
  async ({ page }) => {
    await page.goto('/login');

    await page
      .getByPlaceholder('Email Address')
      .nth(0)
      .fill(account.email);

    await page
      .getByPlaceholder('Password')
      .fill(account.password);

    await page.getByRole('button', {
      name: 'Login',
    }).click();

    await expect(
      page.getByText(`Logged in as ${account.name}`)
    ).toBeVisible();
  }
);