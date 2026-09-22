import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartRows = this.page.locator(
    '#cart_info_table tbody tr'
  );

  async openCartPage() {
    await this.openCart();
  }

  // This returns a Locator, so it should NOT be async.
  getProductRow(productName: string) {
    return this.cartRows.filter({
      hasText: productName,
    });
  }

  async getProductPrice(productName: string): Promise<number> {
    const row = this.getProductRow(productName);

    const priceText = await row
      .locator('.cart_price')
      .innerText();

    return Number(
      priceText.replace(/[^\d]/g, '')
    );
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.cartRows
      .locator('.cart_description h4 a')
      .allTextContents();

    return names.map(name => name.trim());
  }

  async removeProduct(productName: string) {
    const row = this.getProductRow(productName);

    await row
      .locator('.cart_quantity_delete a')
      .click();

    await expect(row).toHaveCount(0);
  }

  async clearCart() {
    while (await this.cartRows.count() > 0) {
      await this.cartRows
        .first()
        .locator('.cart_quantity_delete a')
        .click();
    }
  }

  async verifyCartEmpty() {
    await expect(
      this.page.getByText('Cart is empty!')
    ).toBeVisible();
  }

  async verifyProductExists(productName: string) {
    const row = this.getProductRow(productName);

    await expect(row).toBeVisible();
  }
}