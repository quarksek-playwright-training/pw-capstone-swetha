import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput = this.page.getByPlaceholder('Search Product');

  readonly searchButton = this.page.getByRole('button', {
    name: 'Search',
  });

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
    await expect(
      this.page.getByText('SEARCHED PRODUCTS')
    ).toBeVisible();

    const products = this.productCards;

    const count = await products.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const productText = await products.nth(i).innerText();

      expect(
        productText.toLowerCase()
      ).toContain(searchTerm.toLowerCase());
    }
  }

  async addProduct(productName: string) {
    const product = this.productCards.filter({
      hasText: productName,
    });

    /*
     * XPath sibling axis:
     * The product name and Add to cart button are siblings
     * inside the same product container. There is no reliable
     * getBy* relation that directly expresses this sibling
     * relationship.
     */
    const addToCartButton = product.locator(
      `xpath=.//div[contains(@class,'productinfo')]//p[normalize-space()='${productName}']/following-sibling::a[contains(@class,'add-to-cart')]`
    );

    await product.hover();

    await addToCartButton.click();
  }

  async addFirstProduct() {
    const firstProduct = this.productCards.first();

    /*
     * XPath is used here because we need the button associated
     * with the product container's nested product information.
     * A generic getByRole('link', {name: 'Add to cart'}) would
     * not identify the specific product reliably.
     */
    await firstProduct.hover();

    await firstProduct
      .locator(
        'xpath=.//div[contains(@class,"productinfo")]//a[contains(@class,"add-to-cart")]'
      )
      .click();
  }
}