import {
  test,
  expect,
} from '@playwright/test';

test(
  '@regression @cart state isolation between accounts',
  async ({ browser }) => {

    const account1Context = await browser.newContext({
      storageState: './auth/account1.json',
    });

    const account2Context = await browser.newContext({
      storageState: './auth/account2.json',
    });

    const account1Page =
      await account1Context.newPage();

    const account2Page =
      await account2Context.newPage();

    // -------------------------
    // Account 1
    // -------------------------

    await account1Page.goto('/cart');

    await expect(
      account1Page.getByText('Cart is empty!')
    ).toBeVisible();

    // -------------------------
    // Account 2
    // -------------------------

    await account2Page.goto('/products');

    const firstProduct =
      account2Page.locator('.product-image-wrapper').first();

    await firstProduct.hover();

    await firstProduct
      .locator(
        'a.add-to-cart'
      )
      .click();

    await account2Page.getByRole('link', {
      name: 'Cart',
    }).click();

    await expect(
      account2Page.locator('#cart_info_table tbody tr')
    ).toHaveCount(1);

    // -------------------------
    // Check account 1 again
    // -------------------------

    await account1Page.reload();

    await expect(
      account1Page.locator('#cart_info_table tbody tr')
    ).toHaveCount(0);

    // Cleanup account 2 through UI.
    await account2Page
      .locator(
        '#cart_info_table tbody tr:first-child .cart_quantity_delete a'
      )
      .click();

    await account1Context.close();
    await account2Context.close();
  }
);