import {
  test as setup,
  expect,
  Page,
} from '@playwright/test';

import fs from 'node:fs';
import path from 'node:path';

// Account details
const accounts = [
  {
    name: 'Playwright User One',
    email: 'playwright.user.one@example.com',
    password: 'Playwright@123',
    storage: './auth/account1.json',
  },
  {
    name: 'Playwright User Two',
    email: 'playwright.user.two@example.com',
    password: 'Playwright@123',
    storage: './auth/account2.json',
  },
];

// Create the authentication directory.
const authDirectory = path.resolve(process.cwd(), 'auth');

fs.mkdirSync(authDirectory, { recursive: true });

// Check whether an account already exists and can log in.
async function accountExists(
  page: Page,
  email: string,
  password: string
): Promise<boolean> {
  await page.goto('/login');

  await page
    .locator('[data-qa="login-email"]')
    .fill(email);

  await page
    .locator('[data-qa="login-password"]')
    .fill(password);

  await page
    .locator('[data-qa="login-button"]')
    .click();

  try {
    await expect(
      page.getByText(/Logged in as/)
    ).toBeVisible({ timeout: 5000 });

    return true;
  } catch {
    return false;
  }
}

// Register a new account.
async function createAccount(
  page: Page,
  account: typeof accounts[number]
): Promise<void> {
  await page.goto('/login');

  // Signup form
  const signupForm = page.locator('.signup-form');

  await expect(signupForm).toBeVisible();

  await signupForm
    .locator('[data-qa="signup-name"]')
    .fill(account.name);

  await signupForm
    .locator('[data-qa="signup-email"]')
    .fill(account.email);

  await signupForm
    .locator('[data-qa="signup-button"]')
    .click();

  // Account information
  await expect(
    page.getByText('ENTER ACCOUNT INFORMATION')
  ).toBeVisible();

  await page.getByLabel('Mr.').check();

  await page
    .locator('[data-qa="password"]')
    .fill(account.password);

  await page
    .locator('[data-qa="days"]')
    .selectOption('1');

  await page
    .locator('[data-qa="months"]')
    .selectOption('1');

  await page
    .locator('[data-qa="years"]')
    .selectOption('2000');

  await page
    .getByLabel('Sign up for our newsletter!')
    .check();

  await page
    .getByLabel('Receive special offers from our partners!')
    .check();

  // Address information
  await page
    .locator('[data-qa="first_name"]')
    .fill('Playwright');

  await page
    .locator('[data-qa="last_name"]')
    .fill('User');

  await page
    .locator('[data-qa="company"]')
    .fill('Automation');

  await page
    .locator('[data-qa="address"]')
    .fill('Automation Street');

  await page
    .locator('[data-qa="address2"]')
    .fill('Test Area');

  await page
    .locator('[data-qa="country"]')
    .selectOption({ label: 'India' });

  await page
    .locator('[data-qa="state"]')
    .fill('Karnataka');

  await page
    .locator('[data-qa="city"]')
    .fill('Bengaluru');

  await page
    .locator('[data-qa="zipcode"]')
    .fill('560001');

  await page
    .locator('[data-qa="mobile_number"]')
    .fill('9876543210');

  // Create the account
  await page
    .locator('[data-qa="create-account"]')
    .click();

  await expect(
    page.getByText('ACCOUNT CREATED!')
  ).toBeVisible();

  await page
    .locator('[data-qa="continue-button"]')
    .click();

  await expect(
    page.getByText(`Logged in as ${account.name}`)
  ).toBeVisible();
}

// Create or reuse both persistent accounts.
for (const account of accounts) {
  setup(
    `create or reuse persistent account: ${account.email}`,
    async ({ page, context }) => {
      const loggedIn = await accountExists(
        page,
        account.email,
        account.password
      );

      if (!loggedIn) {
        await createAccount(page, account);
      }

      const storagePath = path.resolve(
        process.cwd(),
        account.storage
      );

      await context.storageState({
        path: storagePath,
      });

      expect(
        fs.existsSync(storagePath)
      ).toBeTruthy();

      console.log(
        `Authentication state saved: ${storagePath}`
      );
    }
  );
}