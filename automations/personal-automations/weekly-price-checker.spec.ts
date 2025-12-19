import { test } from "@playwright/test";
import { WoolworthsPage } from "../page-objects/woolworths-page";
import { NewWorldPage } from "../page-objects/newworld-page";
import products from "../grocery-price-checker-files/products.json";
import { comparePrices } from "../grocery-price-checker-files/price-comparator";

test.describe("Weekly Grocery Price Checker", () => {
  test("Compare Woolworths vs New World prices", async ({ page }) => {
    test.setTimeout(2 * 60 * 1000);
    const woolworths = new WoolworthsPage(page);
    const newworld = new NewWorldPage(page);

    const buyAtWoolworths: string[] = [];
    const buyAtNewWorld: string[] = [];
    const samePrice: string[] = [];
    const newWorldBlocked: string[] = [];

    for (const product of products) {
      console.log(`\n----------------------------------------`);
      console.log(`🔍 Checking: ${product.label}`);
      console.log(`----------------------------------------`);

      // 1) WOOLWORTHS
      let woolworthsPrice: number | null = null;

      try {
        await woolworths.open();
        await woolworths.searchProduct(product.woolworthsQuery);
        await woolworths.waitForResults();

        const matchText = product.woolworthsMatchText ?? product.label;
        woolworthsPrice = await woolworths.getSearchResultPrice(matchText);

        console.log(`Woolworths: $${woolworthsPrice.toFixed(2)}`);
      } catch (err: any) {
        console.warn(
          `⚠️ Woolworths failed for ${product.label}: ${String(
            err?.message ?? err
          )}`
        );
        console.log(`----------------------------------------\n`);
        continue;
      }

      // 2) NEW WORLD (no hard fail; returns null if blocked by Cloudflare)
      const newWorldPrice = await newworld.tryGetPriceEaFromSearch({
        query: product.newWorldQuery,
        matchText: product.newWorldMatchText,
      });

      if (newWorldPrice === null) {
        console.log(`New World : BLOCKED / N/A`);
        newWorldBlocked.push(product.label);

        console.log(`👉 Decision: Buy at Woolworths (New World unavailable)`);
        buyAtWoolworths.push(product.label);

        console.log(`----------------------------------------\n`);
        continue;
      }

      console.log(`New World : $${newWorldPrice.toFixed(2)}`);

      // 3) COMPARISON (only if both prices are available)
      const comparison = comparePrices(
        product.label,
        woolworthsPrice,
        newWorldPrice
      );

      if (comparison.cheapest === "Same") {
        console.log(`⚖️  SAME PRICE in both stores`);
        samePrice.push(product.label);
      } else {
        console.log(`🏆 Better price at: ${comparison.cheapest}`);

        if (comparison.cheapest === "Woolworths")
          buyAtWoolworths.push(product.label);
        if (comparison.cheapest === "New World")
          buyAtNewWorld.push(product.label);
      }

      console.log(`----------------------------------------\n`);
    }

    console.log("\n🧾 FINAL SHOPPING LIST");
    console.log("----------------------------------------");

    console.log("\n🛒 Buy at Woolworths:");
    buyAtWoolworths.forEach((p) => console.log(`  - ${p}`));

    console.log("\n🛒 Buy at New World:");
    buyAtNewWorld.forEach((p) => console.log(`  - ${p}`));

    console.log("\n⚖️ Same price:");
    samePrice.forEach((p) => console.log(`  - ${p}`));

    console.log("\n🧱 New World unavailable (Cloudflare / N/A):");
    newWorldBlocked.forEach((p) => console.log(`  - ${p}`));

    console.log("----------------------------------------\n");
  });
});
