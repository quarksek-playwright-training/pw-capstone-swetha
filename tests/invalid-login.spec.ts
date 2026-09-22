import { test, expect } from '../fixtures/fixtures';

test(
  '@regression @auth @negative invalid password',
  async ({ loginPage }) => {

    await loginPage.openLoginPage();

    await loginPage.login(
      'playwright.user.one@example.com',
      'WrongPassword@999'
    );

    // Verify specific error message
    await expect(
      loginPage.loginError
    ).toBeVisible();

    // Verify login screen is still displayed
    await expect(
      loginPage.loginAccountText
    ).toBeVisible();
  }
);