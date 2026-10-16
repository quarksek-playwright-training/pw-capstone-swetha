import { test, expect } from '../fixtures/fixtures';

test(
  '@smoke cart add product and verify price',
  async ({
    productsPage,
    cartPage,
    request,
  }) => {

    const productName = 'Blue Top';

    await productsPage.openProductsPage();
    await productsPage.openCart();
    await cartPage.clearCart();
    await productsPage.openProductsPage();

    await productsPage.addProduct(productName);

    await productsPage.openCart();

    const uiPrice =
      await cartPage.getProductPrice(productName);

    // Read-only API call.
    const response = await request.get(
      '/api/productsList'
    );

    expect(response.ok()).toBeTruthy();

    const body: {
      products: Array<{ name: string; price: string }>;
    } = await response.json();

    const apiProduct = body.products.find(
      product => product.name === productName
    );

    if (!apiProduct) {
      throw new Error(
        `Product "${productName}" was not returned by the products API`
      );
    }

    const apiPrice = Number(
      apiProduct.price.replace(/[^\d]/g, '')
    );

    expect(Number.isFinite(apiPrice)).toBeTruthy();

    expect(uiPrice).toBe(apiPrice);

    // UI cleanup because there is no cart-delete API.
    await cartPage.removeProduct(productName);
  }
);