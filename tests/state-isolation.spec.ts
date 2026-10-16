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

    const clearCart = async (page: typeof account1Page) => {
      const rows = page.locator('#cart_info_table tbody tr');

      while (await rows.count() > 0) {
        const rowCount = await rows.count();

        await rows
          .first()
          .locator('a.cart_quantity_delete')
          .click();

        await expect(rows).toHaveCount(rowCount - 1);
      }
    };

    try {
      await account1Page.goto('/view_cart');
      await clearCart(account1Page);

      await expect(
        account1Page.locator('#cart_info_table tbody tr')
      ).toHaveCount(0);

      await account2Page.goto('/view_cart');
      await clearCart(account2Page);

      await account2Page.goto('/products');

      const firstProduct =
        account2Page.locator('.product-image-wrapper').first();

      await firstProduct.hover();

      await firstProduct
        .locator('a.add-to-cart')
        .first()
        .click();

      await expect(
        account2Page.getByText('Your product has been added to cart.')
      ).toBeVisible();

      await account2Page.getByRole('link', {
        name: 'View Cart',
      }).click();

      await expect(
        account2Page.locator('#cart_info_table tbody tr')
      ).toHaveCount(1);

      await account1Page.reload();

      await expect(
        account1Page.locator('#cart_info_table tbody tr')
      ).toHaveCount(0);
    } finally {
      try {
        await account2Page.goto('/view_cart');
        await clearCart(account2Page);
      } finally {
        await Promise.all([
          account1Context.close(),
          account2Context.close(),
        ]);
      }
    }
  }
);