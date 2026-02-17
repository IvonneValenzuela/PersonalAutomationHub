import { expect, test } from "@playwright/test";
import { WoolworthsPage } from "../page-objects/woolworths-stock-and-price-page.ts";
import products from "../grocery-price-checker-files/products-woolworths.json";

type Result = {
  id: string;
  label: string;
  category: string;
  unit?: string;
  price: number | null;
  inStock: boolean | null;
};

test.describe("Weekly Woolworths Price Checker", () => {
  test("Get Woolworths prices for my list (grouped by category)", async ({
    page,
  }) => {
    test.setTimeout(Math.max(2 * 60 * 1000, products.length * 25_000));

    const woolworths = new WoolworthsPage(page);
    const results: Result[] = [];

    // ✅ Open and set store once
    await woolworths.open();
    await woolworths.setLocation();
    await expect(woolworths.locationSelected).toBeVisible();

    for (const product of products) {
      console.log(`\n----------------------------------------`);
      console.log(`🔍 Checking: ${product.label}`);
      console.log(`----------------------------------------`);

      try {
        await woolworths.searchProduct(product.woolworthsQuery);
        await woolworths.waitForResults();

        const matchText = product.woolworthsMatchText ?? product.label;

        const { price, inStock } =
          await woolworths.getSearchResultDetails(matchText);

        const unitLabel = product.unit ? ` per ${product.unit}` : "";

        const stockText =
          inStock === null
            ? "⚪ Stock: N/A"
            : inStock
              ? "✅ In stock"
              : "❌ Out of stock";

        console.log(
          `${stockText} — Price now: $${price.toFixed(2)}${unitLabel}`,
        );

        results.push({
          id: product.id,
          label: product.label,
          category: product.category,
          unit: product.unit,
          price,
          inStock,
        });
      } catch (err: any) {
        console.warn(
          `⚠️ Woolworths error for ${product.label}: ${String(
            err?.message ?? err,
          )}`,
        );

        results.push({
          id: product.id,
          label: product.label,
          category: product.category,
          unit: product.unit,
          price: null,
          inStock: null,
        });
      } finally {
        await page.waitForTimeout(300 + Math.random() * 700);

        // 🔹 Important: go back to home before next iteration
        await woolworths.goHome();
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

    const storeName = await woolworths.getCurrentStore();
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-NZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const divider = "───────────────────────────────";

    console.log(divider);
    console.log("\n🧾 PRICE NOW — GROUPED BY CATEGORY");
    console.log(`📍 Store: ${storeName ?? "Unknown"}`);
    console.log(`🗓  Date: ${formattedDate}`);
    console.log(divider);

    const categories = Array.from(grouped.keys()).sort((a, b) =>
      a.localeCompare(b),
    );

    for (const category of categories) {
      const items = grouped.get(category)!;

      const categoryTotal = items
        .filter((x) => x.price !== null)
        .reduce((sum, x) => sum + (x.price as number), 0);

      const missingCount = items.filter((x) => x.price === null).length;
      const outOfStockCount = items.filter((x) => x.inStock === false).length;

      // --- Compute padding for nicer alignment (per category)
      const labelWidth = Math.max(...items.map((i) => i.label.length), 10);

      const priceStrings = items.map((i) => {
        const unitLabel = i.unit ? ` per ${i.unit}` : "";
        return i.price !== null ? `$${i.price.toFixed(2)}${unitLabel}` : "N/A";
      });
      const priceWidth = Math.max(...priceStrings.map((s) => s.length), 6);

      console.log(`\n🛒 ${category.toUpperCase()}`);
      console.log(divider);

      items.forEach((item, idx) => {
        const unitLabel = item.unit ? ` per ${item.unit}` : "";
        const priceText =
          item.price !== null ? `$${item.price.toFixed(2)}${unitLabel}` : "N/A";

        const stockIcon =
          item.inStock === null ? "⚪" : item.inStock ? "✅" : "❌";

        const left = item.label.padEnd(labelWidth + 3);
        const mid = priceText.padEnd(priceWidth + 3);

        console.log(`${left}${mid}${stockIcon}`);
      });

      console.log(`\nSubtotal: $${categoryTotal.toFixed(2)}`);
      console.log(`Out of stock: ${outOfStockCount}`);
      if (missingCount > 0) console.log(`Missing prices: ${missingCount}`);
    }

    const grandTotal = results
      .filter((x) => x.price !== null)
      .reduce((sum, x) => sum + (x.price as number), 0);

    console.log("\n========================================");
    console.log(`🧮 GRAND TOTAL (known prices): $${grandTotal.toFixed(2)}`);
    console.log("========================================\n");
  });
});
