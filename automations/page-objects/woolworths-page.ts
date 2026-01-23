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
    await this.page.goto(this.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
  }

  async resetSearch(): Promise<void> {
    await this.searchInput.waitFor({ state: "visible", timeout: 5000 });
    await this.searchInput.fill("");
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

    //Find the correct product link in search results
    const productLink = this.page
      .locator('a[href*="productdetails"]')
      .filter({ hasText: new RegExp(safe, "i") })
      .first();

    // Wait until the product link is visible before interacting with it
    await productLink.waitFor({ state: "visible", timeout: 15000 });

    //Open the product details page
    await productLink.click();

    //Read the price from the product page (any unit: each/kg/etc.)
    const priceHeading = this.page.locator('h3[aria-label*="$"]').first();
    // Wait until the price is visible on the page
    await priceHeading.waitFor({ state: "visible", timeout: 25000 });

    // Extract the raw price text from the element
    const priceText = await priceHeading.getAttribute("aria-label");
    if (!priceText)
      throw new Error("Woolworths: product price is not available");

    // Extract the numeric value from the price text
    const match = priceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    if (!match)
      throw new Error(
        `Woolworths: could not extract numeric price from "${priceText}"`,
      );

    // Return the price as a number
    return Number(match[1]);
  }
}
