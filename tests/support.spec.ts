import {
  test,
  expect,
} from '@playwright/test';

test(
  '@regression @support contact form confirmation dialog',
  async ({ page }) => {
    await page.goto('/contact_us', { waitUntil: 'load' });

    // Verify that the contact form is displayed.
    await expect(
      page.getByText('GET IN TOUCH')
    ).toBeVisible();

    await expect.poll(
      () => page.evaluate(() =>
        typeof (window as Window & { jQuery?: unknown }).jQuery
      )
    ).toBe('function');
    await expect.poll(
      () => page.evaluate(() =>
        Array.from(document.scripts).some(script =>
          script.textContent?.includes('#contact-us-form')
        )
      )
    ).toBe(true);

    // Fill in the contact form.
    await page
      .getByPlaceholder('Name')
      .fill('Playwright User');

    await page
      .locator('input[data-qa="email"]')
      .fill('playwright.support@example.com');

    await page
      .getByPlaceholder('Subject')
      .fill('Automation test');

    await page
      .getByPlaceholder('Your Message Here')
      .fill('This is an automated support test.');

    const dialogPromise = page.waitForEvent('dialog');
    const clickPromise = page.getByRole('button', {
      name: 'Submit',
    }).click();

    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toBe('Press OK to proceed!');
    await dialog.accept();
    await clickPromise;

    await expect(
      page.locator('#form-section a.btn-success')
    ).toBeVisible();
  }
);