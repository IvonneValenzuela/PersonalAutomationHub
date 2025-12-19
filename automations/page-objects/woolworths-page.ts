import { type Locator, type Page } from "@playwright/test";

export class WoolworthsPage {
  private readonly url = "https://www.woolworths.co.nz/";
  private readonly page: Page;

  // 🔍 Search
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByPlaceholder(/search/i);
  }

  async open(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
  }

  async backToHome(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });

    const ready = await this.searchInput
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!ready) {
      await this.page.reload({ waitUntil: "domcontentloaded" });
      await this.searchInput.waitFor({ state: "visible", timeout: 10000 });
    }
  }

  async searchProduct(query: string): Promise<void> {
    await this.searchInput.fill("");
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async waitForResults(): Promise<void> {
    await this.page
      .locator('h3[aria-label*="$"]')
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
  }

  async getSearchResultPrice(matchText: string): Promise<number> {
    const safe = matchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 1) Find the correct product link in search results
    const productLink = this.page
      .locator('a[href*="productdetails"]')
      .filter({ hasText: new RegExp(safe, "i") })
      .first();

    await productLink.waitFor({ state: "visible", timeout: 15000 });

    // 2) Open the product details page
    await productLink.click();

    // 3) Read the price from the product page (any unit: each/kg/etc.)
    const priceHeading = this.page.locator('h3[aria-label*="$"]').first();
    await priceHeading.waitFor({ state: "visible", timeout: 15000 });

    const aria = await priceHeading.getAttribute("aria-label");
    if (!aria)
      throw new Error("No aria-label found on Woolworths product price");

    const match = aria.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    if (!match)
      throw new Error(`Could not parse price from aria-label: "${aria}"`);

    return Number(match[1]);
  }
}
