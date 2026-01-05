import { test } from "@playwright/test";
import { WoolworthsPage } from "../page-objects/woolworths-page";
import products from "../grocery-price-checker-files/products-woolworths.json";

type Result = {
  id: string;
  label: string;
  category: string;
  unit?: string;
  price: number | null;
};

test.describe("Weekly Woolworths Price Checker", () => {
  test("Get Woolworths prices for my list (grouped by category)", async ({
    page,
  }) => {
    test.setTimeout(Math.max(2 * 60 * 1000, products.length * 25_000));

    const woolworths = new WoolworthsPage(page);
    const results: Result[] = [];

    for (const product of products) {
      console.log(`\n----------------------------------------`);
      console.log(`🔍 Checking: ${product.label}`);
      console.log(`----------------------------------------`);

      try {
        await woolworths.open();
        await woolworths.searchProduct(product.woolworthsQuery);
        await woolworths.waitForResults();

        const matchText = product.woolworthsMatchText ?? product.label;
        const price = await woolworths.getSearchResultPrice(matchText);

        const unitLabel = product.unit ? ` per ${product.unit}` : "";
        console.log(`Price now: $${price.toFixed(2)}${unitLabel}`);

        results.push({
          id: product.id,
          label: product.label,
          category: product.category,
          unit: product.unit,
          price,
        });
      } catch (err: any) {
        console.warn(
          `⚠️ Woolworths error for ${product.label}: ${String(
            err?.message ?? err
          )}`
        );

        results.push({
          id: product.id,
          label: product.label,
          category: product.category,
          unit: product.unit,
          price: null,
        });
      } finally {
        await page.waitForTimeout(300 + Math.random() * 700);
        await woolworths.resetSearch();
      }
    }

    // ✅ Group by category
    const grouped = new Map<string, Result[]>();
    for (const r of results) {
      const key = r.category || "uncategorised";
      const list = grouped.get(key) ?? [];
      list.push(r);
      grouped.set(key, list);
    }

    // ✅ final result
    console.log("\n🧾 PRICE NOW — GROUPED BY CATEGORY");
    console.log("========================================");

    const categories = Array.from(grouped.keys()).sort((a, b) =>
      a.localeCompare(b)
    );

    for (const category of categories) {
      const items = grouped.get(category)!;

      const categoryTotal = items
        .filter((x) => x.price !== null)
        .reduce((sum, x) => sum + (x.price as number), 0);

      const missingCount = items.filter((x) => x.price === null).length;

      console.log(`\n🛒 ${category.toUpperCase()}`);
      console.log("----------------------------------------");

      for (const item of items) {
        const unitLabel = item.unit ? ` per ${item.unit}` : "";
        const priceText =
          item.price !== null ? `$${item.price.toFixed(2)}${unitLabel}` : "N/A";

        console.log(`- ${item.label} — ${priceText}`);
      }

      console.log(`Subtotal (${category}): $${categoryTotal.toFixed(2)}`);
      if (missingCount > 0) {
        console.log(`Missing prices: ${missingCount}`);
      }
    }

    const grandTotal = results
      .filter((x) => x.price !== null)
      .reduce((sum, x) => sum + (x.price as number), 0);

    console.log("\n========================================");
    console.log(`🧮 GRAND TOTAL (known prices): $${grandTotal.toFixed(2)}`);
    console.log("========================================\n");
  });
});
