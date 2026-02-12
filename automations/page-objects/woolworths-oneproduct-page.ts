import { type Locator, type Page } from "@playwright/test";

export class WoolworthsPage1 {
  private readonly url = "https://www.woolworths.co.nz/";
  private readonly page: Page;

  // 🔍 Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // ✅ Selector estable (según tu HTML)
    this.searchInput = page.locator('input[data-cy="search"]'); // o page.locator("#search")
    this.searchButton = page.locator('button[data-cy="search-icon"]');
  }

  async open(): Promise<void> {
    await this.page.goto(this.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // ✅ Asegura que el search esté listo (evita flakiness en CI)
    await this.searchInput.waitFor({ state: "visible", timeout: 25000 });
  }

  async resetSearch(): Promise<void> {
    await this.searchInput.waitFor({ state: "visible", timeout: 25000 });
    await this.searchInput.fill("");
  }

  async searchProduct(query: string): Promise<void> {
    await this.searchInput.waitFor({ state: "visible", timeout: 25000 });
    await this.searchInput.click({ timeout: 5000 });
    await this.searchInput.fill(query);

    // ✅ Puedes usar Enter o click en el botón; Enter suele ir bien
    await this.searchInput.press("Enter");

    // Si en CI Enter no dispara, cambia por:
    // await this.searchButton.click();
  }

  async waitForResults(): Promise<void> {
    await this.page
      .locator('h3[aria-label*="$"]')
      .first()
      .waitFor({ state: "visible", timeout: 25000 });
  }

  async getSearchResultPrice(matchText: string): Promise<number> {
    const safe = matchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const productLink = this.page
      .locator('a[href*="productdetails"]')
      .filter({ hasText: new RegExp(safe, "i") })
      .first();

    await productLink.waitFor({ state: "visible", timeout: 20000 });
    await productLink.click();

    const priceHeading = this.page.locator('h3[aria-label*="$"]').first();
    await priceHeading.waitFor({ state: "visible", timeout: 25000 });

    const priceText = await priceHeading.getAttribute("aria-label");
    if (!priceText)
      throw new Error("Woolworths: product price is not available");

    const match = priceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    if (!match) {
      throw new Error(
        `Woolworths: could not extract numeric price from "${priceText}"`
      );
    }

    return Number(match[1]);
  }
}
