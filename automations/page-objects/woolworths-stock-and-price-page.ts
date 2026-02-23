import { type Locator, type Page } from "@playwright/test";

export class WoolworthsPage {
  private readonly url = "https://www.woolworths.co.nz/";
  private readonly page: Page;

  //Select store branch
  changeBranch: Locator;
  pickUpButton: Locator;
  changeStoreButton: Locator;
  storeDropdownButton: Locator;
  myClosesLocation: Locator;
  mainPage: Locator;
  locationSelected: Locator;

  // 🔍 Search
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.changeBranch = page.getByRole("link", { name: "Change location" });
    this.pickUpButton = page.getByRole("radio", { name: "Pick up" });
    this.changeStoreButton = page.getByRole("button", { name: "Change store" });
    this.storeDropdownButton = page.getByLabel("Region");
    this.myClosesLocation = page.getByRole("button", {
      name: "Woolworths Johnsonville 31",
    });
    this.locationSelected = page.getByText("Johnsonville store");
    this.mainPage = page.getByRole("link", {
      name: "Online Supermarket: Online",
    });

    this.searchInput = page.getByPlaceholder(/search/i);
  }

  async open(): Promise<void> {
    await this.page.goto(this.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
  }

  /**
   * This method sets the desire location based on the store
   * @param storeID (optional) selects the desire store, if null, defaults to 297 (Johnsonville)
   */
  async setLocation(storeID: string = "297"): Promise<void> {
    await this.changeBranch.click();
    await this.pickUpButton.click();
    await this.changeStoreButton.click();
    await this.storeDropdownButton.selectOption(storeID);
    await this.myClosesLocation.click();
    await this.mainPage.click();
  }

  async goHome(): Promise<void> {
    await this.mainPage.click();
    await this.searchInput.waitFor({ state: "visible", timeout: 15000 });
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

  /**
   * Determines stock status using the real CTA button state.
   * Returns:
   * - true  → In stock
   * - false → Out of stock
   * - null  → Unknown (should be rare)
   */
  async getStockStatus(): Promise<boolean | null> {
    const ctaButton = this.page
      .locator(
        '[data-cy="addToTrolleyBtn"], [attr\\.data-cy="addToTrolleyBtn"]',
      )
      .first();

    try {
      await ctaButton.waitFor({ state: "visible", timeout: 15000 });
    } catch {
      return null;
    }

    const ariaDisabled = await ctaButton.getAttribute("aria-disabled");
    const text = (await ctaButton.textContent())?.toLowerCase() ?? "";

    if (ariaDisabled === "false") return true;
    if (ariaDisabled === "true") return false;

    if (text.includes("add to trolley")) return true;
    if (text.includes("out of stock")) return false;

    return null;
  }

  /**
   * Opens product details page and returns price + stock.
   */
  async getSearchResultDetails(
    matchText: string,
  ): Promise<{ price: number; inStock: boolean | null }> {
    const safe = matchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const productLink = this.page
      .locator('a[href*="productdetails"]')
      .filter({ hasText: new RegExp(safe, "i") })
      .first();

    await productLink.waitFor({ state: "visible", timeout: 15000 });
    await productLink.click();

    // 🔹 Ensure PDP fully loaded before checking stock
    await this.page.waitForLoadState("domcontentloaded");

    const priceHeading = this.page.locator('h3[aria-label*="$"]').first();
    await priceHeading.waitFor({ state: "visible", timeout: 25000 });

    const priceText = await priceHeading.getAttribute("aria-label");
    if (!priceText)
      throw new Error("Woolworths: product price is not available");

    const match = priceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    if (!match)
      throw new Error(
        `Woolworths: could not extract numeric price from "${priceText}"`,
      );

    const price = Number(match[1]);
    const inStock = await this.getStockStatus();

    return { price, inStock };
  }

  // Backwards compatibility
  async getSearchResultPrice(matchText: string): Promise<number> {
    const { price } = await this.getSearchResultDetails(matchText);
    return price;
  }

  async getCurrentStore(): Promise<string | null> {
    const text = await this.locationSelected.textContent().catch(() => null);
    return text?.replace(" store", "").trim() ?? null;
  }
}
