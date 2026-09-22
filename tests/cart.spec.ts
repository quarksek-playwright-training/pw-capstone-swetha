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

    await productsPage.addProduct(productName);

    await productsPage.openCart();

    const uiPrice =
      await cartPage.getProductPrice(productName);

    // Read-only API call.
    const response = await request.get(
      '/api/productsList'
    );

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    const apiProduct = body.products.find(
      (product: any) =>
        product.name === productName
    );

    expect(apiProduct).toBeDefined();

    const apiPrice = Number(apiProduct.price);

    expect(uiPrice).toBe(apiPrice);

    // UI cleanup because there is no cart-delete API.
    await cartPage.removeProduct(productName);
  }
);