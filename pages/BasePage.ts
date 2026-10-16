import { expect, Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async open(path: string = '/') {
    await this.page.goto(path);
  }

  async goToHome() {
    await this.page.goto('/');
  }

  async openLogin() {
    await this.page.getByRole('link', { name: 'Signup / Login' }).click();
  }

  async openProducts() {
    await this.page.getByRole('link', { name: 'Products' }).click();
  }

  async openCart() {
    const modalViewCart = this.page
      .locator('#cartModal')
      .getByRole('link', { name: 'View Cart' });

    if (await modalViewCart.isVisible()) {
      await modalViewCart.click();
      return;
    }

    await this.page.getByRole('link', { name: 'Cart' }).first().click();
  }

  async openContactUs() {
    await this.page.getByRole('link', { name: 'Contact us' }).click();
  }

  async verifyLoggedIn(username: string) {
    await expect(
      this.page.getByText(`Logged in as ${username}`)
    ).toBeVisible();
  }
}