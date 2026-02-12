import { test, expect } from "@playwright/test";
import { WoolworthsPage1 } from "../page-objects/woolworths-oneproduct-page";
import oneProduct from "../grocery-price-checker-files/one-product-woolworths.json";

type OneProduct = {
  id: string;
  label: string;
  category: string;
  unit?: string;
  woolworthsQuery: string;
};

test("Woolworths search Kalo yogurt", async ({ page }) => {
  test.setTimeout(60_000);

  const product = (oneProduct as OneProduct[])[0];
  const woolworths = new WoolworthsPage1(page);

  try {
    await woolworths.open();
  } catch (e: any) {
    test.skip(true, `External site did not load: ${String(e?.message ?? e)}`);
  }

  await woolworths.searchProduct(product.woolworthsQuery);
  await woolworths.waitForResults();

  const firstPrice = page.locator('h3[aria-label*="$"]').first();
  await expect(firstPrice).toBeVisible({ timeout: 25000 });

  const aria = await firstPrice.getAttribute("aria-label");
  expect(aria).toContain("$");

  console.log(
    `✅ Search OK for: ${product.label} — first price aria-label: ${aria}`
  );
});
