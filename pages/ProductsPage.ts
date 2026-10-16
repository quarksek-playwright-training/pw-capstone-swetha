import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput = this.page.getByPlaceholder('Search Product');

  readonly searchButton = this.page.locator('#submit_search');

  readonly productCards = this.page.locator('.product-image-wrapper');

  async openProductsPage() {
    await this.goToHome();
    await this.openProducts();
  }

  async searchProduct(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }

  async verifySearchResults(searchTerm: string) {
    // Verify that the searched products heading is displayed.
    await expect(
      this.page.getByText('SEARCHED PRODUCTS')
    ).toBeVisible();

    // Verify that at least one product card is displayed.
    const count = await this.productCards.count();

    expect(
      count,
      `Expected search results for "${searchTerm}"`
    ).toBeGreaterThan(0);
  }

  async addProduct(productName: string) {
    // Find the product card containing the requested product.
    const product = this.productCards.filter({
      hasText: productName,
    });

    // Use XPath to locate the Add to cart link next to the product name.
    const addToCartButton = product.locator(
      `xpath=.//div[contains(@class,'productinfo')]//p[normalize-space()='${productName}']/following-sibling::a[contains(@class,'add-to-cart')]`
    );

    await expect(product).toHaveCount(1);

    await product.hover();
    await addToCartButton.click();

    await expect(
      this.page.getByText('Your product has been added to cart.')
    ).toBeVisible();
  }

  async addFirstProduct() {
    // Select the first product card.
    const firstProduct = this.productCards.first();

    await expect(firstProduct).toBeVisible();

    await firstProduct.hover();

    // Use XPath to locate the Add to cart link inside the first product card.
    await firstProduct
      .locator(
        'xpath=.//div[contains(@class,"productinfo")]//a[contains(@class,"add-to-cart")]'
      )
      .click();
  }
}