import { type Locator, type Page } from "@playwright/test";

export class NewWorldPage {
  private readonly url = "https://www.newworld.co.nz/";
  private readonly page: Page;

  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // ✅ Cloudflare guard-rail
  private readonly humanVerifyText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.locator('[data-testid="search-bar-input"]:visible');
    this.searchButton = page.getByRole("button", { name: "Search" });

    this.humanVerifyText = page.getByText(/verify you are human/i);
  }

  async open(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
  }

  // ✅ Passive block detection
  private async isHumanVerificationVisible(): Promise<boolean> {
    return await this.humanVerifyText
      .isVisible({ timeout: 2000 })
      .catch(() => false);
  }

  // ✅ Guard rail reusable
  private async throwIfBlocked(): Promise<void> {
    if (await this.isHumanVerificationVisible()) {
      throw new Error("CLOUDFLARE_BLOCKED");
    }
  }

  async searchProduct(query: string): Promise<void> {
    // ⏱️ Fail fast: if the input never appears, don't wait 30s
    const inputVisible = await this.searchInput
      .isVisible({ timeout: 4000 })
      .catch(() => false);

    if (!inputVisible) {
      throw new Error("CLOUDFLARE_BLOCKED");
    }

    await this.searchInput.fill(query, { timeout: 4000 });
    await this.searchInput.press("Enter");
  }

  async waitForResults(): Promise<void> {
    const resultsVisible = await this.page
      .getByTestId("product-title")
      .first()
      .isVisible({ timeout: 6000 })
      .catch(() => false);

    if (!resultsVisible) {
      throw new Error("CLOUDFLARE_BLOCKED");
    }
  }

  async openResultByTitle(matchText: string): Promise<void> {
    await this.throwIfBlocked();

    const productLink = this.page
      .locator('a[href^="/shop/product/"]')
      .filter({
        has: this.page
          .getByTestId("product-title")
          .filter({ hasText: matchText }),
      })
      .first();

    await productLink.waitFor({ state: "visible", timeout: 15000 });
    await productLink.click();
  }

  async getProductPagePriceEa(): Promise<number> {
    await this.throwIfBlocked();

    const priceBlock = this.page
      .locator(
        'div:has([data-testid="price-dollars"]):has([data-testid="price-cents"]):has([data-testid="price-per"])'
      )
      .filter({ hasText: /\/\s*ea/i })
      .first();

    await priceBlock.waitFor({ state: "visible", timeout: 15000 });

    const dollarsText = (
      await priceBlock
        .locator('[data-testid="price-dollars"]')
        .first()
        .textContent()
    )?.trim();

    const centsText = (
      await priceBlock
        .locator('[data-testid="price-cents"]')
        .first()
        .textContent()
    )?.trim();

    if (!dollarsText) {
      throw new Error("No dollars found on New World product page");
    }

    const dollars = Number(dollarsText.replace(/\D/g, ""));
    const cents = centsText ? Number(centsText.replace(/\D/g, "")) : 0;

    return Number(`${dollars}.${String(cents).padStart(2, "0")}`);
  }

  // ✅ One-shot helper for specs: returns price or null
  async tryGetPriceEaFromSearch(params: {
    query: string;
    matchText: string;
  }): Promise<number | null> {
    try {
      await this.open();
      await this.searchProduct(params.query);
      await this.waitForResults();
      await this.openResultByTitle(params.matchText);
      return await this.getProductPagePriceEa();
    } catch (err: any) {
      const message = String(err?.message ?? err);

      if (message.includes("CLOUDFLARE_BLOCKED")) {
        console.warn("⚠️ New World blocked by Cloudflare. Returning null.");
        return null;
      }

      // Other errors
      console.warn(`⚠️ New World error: ${message}. Returning null.`);
      return null;
    }
  }
}
