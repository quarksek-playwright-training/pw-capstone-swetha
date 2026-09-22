import {
  test,
  expect,
} from '@playwright/test';

test(
  '@regression @support contact form confirmation dialog',
  async ({ page }) => {

    await page.goto('/');

    await page.getByRole('link', {
      name: 'Contact us',
    }).click();

    await expect(
      page.getByText('GET IN TOUCH')
    ).toBeVisible();

    await page
      .getByPlaceholder('Name')
      .fill('Playwright User');

    await page
      .getByPlaceholder('Email')
      .fill(
        'playwright.support@example.com'
      );

    await page
      .getByPlaceholder('Subject')
      .fill('Automation test');

    await page
      .getByPlaceholder('Your Message Here')
      .fill(
        'This is an automated support test.'
      );

    // Native browser confirmation dialog.
    page.once('dialog', async dialog => {

      expect(dialog.type()).toBe('confirm');

      await dialog.accept();
    });

    await page.getByRole('button', {
      name: 'Submit',
    }).click();

    await expect(
      page.getByText(
        'Success! Your details have been submitted successfully.'
      )
    ).toBeVisible();
  }
);