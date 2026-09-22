import {
  test as setup,
  expect,
  Page,
} from '@playwright/test';

import fs from 'fs';

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

async function accountExists(
  page: Page,
  email: string,
  password: string
): Promise<boolean> {
  await page.goto('/login');

  await page.getByPlaceholder('Email Address').nth(0).fill(email);

  await page.getByPlaceholder('Password').fill(password);

  await page.getByRole('button', {
    name: 'Login',
  }).click();

  await page.waitForLoadState('domcontentloaded');

  return await page
    .getByText(/Logged in as/)
    .isVisible()
    .catch(() => false);
}

async function createAccount(
  page: Page,
  account: typeof accounts[number]
) {
  await page.goto('/login');

  await page
    .getByPlaceholder('Name')
    .fill(account.name);

  await page
    .locator('form')
    .filter({ hasText: 'New User Signup!' })
    .getByPlaceholder('Email Address')
    .fill(account.email);

  await page.getByRole('button', {
    name: 'Signup',
  }).click();

  await expect(
    page.getByText('ENTER ACCOUNT INFORMATION')
  ).toBeVisible();

  await page.getByLabel('Mr.').check();

  await page.getByLabel('Password').fill(account.password);

  await page
    .getByLabel('Date of birth')
    .selectOption('1');

  await page
    .locator('#months')
    .selectOption('1');

  await page
    .locator('#years')
    .selectOption('2000');

  await page
    .getByLabel('Sign up for our newsletter!')
    .check();

  await page
    .getByLabel('Receive special offers from our partners!')
    .check();

  await page
    .getByLabel('First name')
    .fill('Playwright');

  await page
    .getByLabel('Last name')
    .fill('User');

  await page
    .getByLabel('Company')
    .fill('Automation');

  await page
    .getByLabel('Address')
    .fill('Automation Street');

  await page
    .getByLabel('Address 2')
    .fill('Test Area');

  await page
    .getByLabel('Country')
    .selectOption({ label: 'India' });

  await page
    .getByLabel('State')
    .fill('Karnataka');

  await page
    .getByLabel('City')
    .fill('Bengaluru');

  await page
    .getByLabel('Zipcode')
    .fill('560001');

  await page
    .getByLabel('Mobile Number')
    .fill('9876543210');

  await page.getByRole('button', {
    name: 'Create Account',
  }).click();

  await expect(
    page.getByText('ACCOUNT CREATED!')
  ).toBeVisible();

  await page.getByRole('link', {
    name: 'Continue',
  }).click();

  await expect(
    page.getByText(`Logged in as ${account.name}`)
  ).toBeVisible();
}

for (const account of accounts) {
  setup(
    `create persistent account: ${account.email}`,
    async ({ page, context }) => {
      let loggedIn = false;

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

      loggedIn = await page
        .getByText(/Logged in as/)
        .isVisible()
        .catch(() => false);

      if (!loggedIn) {
        await createAccount(page, account);
      }

      await context.storageState({
        path: account.storage,
      });

      expect(
        fs.existsSync(account.storage)
      ).toBeTruthy();
    }
  );
}