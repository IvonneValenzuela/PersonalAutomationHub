import { test, expect } from "@playwright/test";
import { WoolworthsPage } from "../page-objects/woolworths-page";
import oneProduct from "../grocery-price-checker-files/one-product-woolworths.json";

type OneProduct = {
  id: string;
  label: string;
  category: string;
  unit?: string;
  woolworthsQuery: string;
  woolworthsMatchText?: string;
};

test("Woolworths - one product price check (CI)", async ({ page }) => {
  test.setTimeout(60_000);

  const product = (oneProduct as OneProduct[])[0];
  const woolworths = new WoolworthsPage(page);

  await woolworths.open();
  await woolworths.searchProduct(product.woolworthsQuery);
  await woolworths.waitForResults();

  const matchText = product.woolworthsMatchText ?? product.label;
  const price = await woolworths.getSearchResultPrice(matchText);

  expect(price).toBeGreaterThan(0);
  expect(price).toBeLessThan(500);

  console.log(
    `✅ ${product.label}: $${price.toFixed(2)}${product.unit ? ` per ${product.unit}` : ""}`
  );
});
