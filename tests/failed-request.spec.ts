import { test, expect } from '@playwright/test';

test(
  '@regression @cart @negative failed product request',
  async ({ page }) => {

    await page.route(
      '**/products',
      async route => {
        await route.abort('failed');
      }
    );

    const responseError = page.waitForEvent(
      'requestfailed'
    );

    await page.goto('/');

    await page.getByRole('link', {
      name: 'Products',
    }).click();

    await responseError;

    // The document request itself failed.
    // Verify that Playwright observed the failed request
    // rather than silently proceeding as though the request succeeded.
    await expect(
      page.getByText('ALL PRODUCTS')
    ).not.toBeVisible();
  }
);