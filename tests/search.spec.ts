import {
  test,
  expect,
} from '../fixtures/fixtures';

import { searchTerms } from '../data/searchTerms';

for (const searchTerm of searchTerms) {

  test(
    `[regression] [search] search product: ${searchTerm}`,
    async ({ productsPage }) => {

      await productsPage.openProductsPage();

      await productsPage.searchProduct(
        searchTerm
      );

      await productsPage.verifySearchResults(
        searchTerm
      );
    }
  );
}