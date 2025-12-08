/* 🐱 This is a personal automation project to solve a real need:
my cats live in Colombia with my mum, and it takes time to manually purchase
their food and litter online. My mum is in her 60s and is not comfortable
buying these products online, so this flow helps me place the orders for her.🐱*/

import { type Locator, type Page } from "@playwright/test";

export class CatStorePage {
  private readonly url = "https://www.depelos.co/";
  private readonly page: Page;

  //Login
  readonly loginButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;

  //Look for my 🐱 prefered litter
  readonly catMenuButton: Locator;
  readonly catLitterMenu: Locator;
  readonly litterBrandsContainer: Locator;
  readonly preferredLitterBrand: Locator;
  readonly lavenderLitterOption: Locator;
  readonly litterSizeSelect: Locator;

  //Add to cart
  readonly addToCartButton: Locator;
  readonly finalizeOrderButton: Locator;
  readonly nextStepButtonCart: Locator;

  //Payment and delivery process
  readonly deliveryDateInput: Locator;
  readonly paymentTypeRadio: Locator;
  readonly acceptTermsButton: Locator;
  readonly nextStepAfterTermsButton: Locator;
  readonly confirmAndSendOrderButton: Locator;

  readonly datePickerOkButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const catMenu = page.locator(".dropdown-menu-gatos");

    //Login
    this.loginButton = page.getByRole("link", {
      name: "REGÍSTRATE / INICIA SESIÓN",
    });

    this.emailInput = page.getByLabel("Correo electrónico *");
    this.passwordInput = page.getByLabel("Contraseña *");

    this.loginSubmitButton = page.getByRole("button", { name: "INGRESAR" });

    //Look for my 🐱 prefered litter
    this.catMenuButton = page.getByText("Gatos", { exact: true });

    this.catLitterMenu = catMenu.getByRole("link", {
      name: "Arena para Gatos",
    });

    this.litterBrandsContainer = page.locator(".acordeon__contenido");

    this.preferredLitterBrand = this.litterBrandsContainer.getByRole("link", {
      name: "JvCats",
    });

    this.lavenderLitterOption = page.getByText("Arena JvCats Olor a Lavanda");

    this.litterSizeSelect = page.locator("#ProductCartForm_product_variant_id");

    //Add to cart
    this.addToCartButton = page.getByRole("button", {
      name: "Agregar al carrito",
    });

    this.finalizeOrderButton = page.getByRole("link", {
      name: /finalizar la orden/i,
    });

    this.nextStepButtonCart = page
      .getByRole("button", { name: "Siguiente" })
      .first();

    //Payment and delivery process
    this.deliveryDateInput = page.locator("#UserOrderForm_delivery_date");

    this.datePickerOkButton = page.getByRole("button", { name: "OK" });

    this.paymentTypeRadio = page.getByRole("radio", {
      name: "Efectivo (Contraentrega)",
    });

    this.acceptTermsButton = page.locator(
      "#UserOrderForm_global_terms_acceptance"
    );

    this.nextStepAfterTermsButton = page.locator("button.btn-next-checkout");

    this.confirmAndSendOrderButton = page
      .locator("#daycare_request_form")
      .getByRole("link", { name: "Finalizar pedido" });
  }

  //Methods

  async open(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
  }

  async clickOnLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    if (!email) {
      throw new Error(`Email not found - ${email}`);
    }

    if (!password) {
      throw new Error(`Password not found - ${password}`);
    }

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  async clickOnCatMenuButton(): Promise<void> {
    await this.catMenuButton.click();
  }

  async clickOnCatsLitter(): Promise<void> {
    await this.catLitterMenu.click();
  }

  async clickOnPreferredLitterBrand(): Promise<void> {
    await this.preferredLitterBrand.click();
  }

  async clickOnLavenderLitterFragrance(): Promise<void> {
    await this.lavenderLitterOption.click();
  }

  async selectJvCatsLavanda5kg(): Promise<void> {
    await this.litterSizeSelect.selectOption("1004");
  }

  async clickOnAddToCartButton(): Promise<void> {
    await this.addToCartButton.click();
  }

  async clickFinalizeOrder(): Promise<void> {
    await this.finalizeOrderButton.click();
  }

  async clickOnNextStepButton(): Promise<void> {
    await this.nextStepButtonCart.click();
  }

  async setDeliveryDate(date: string): Promise<void> {
    await this.deliveryDateInput.click();
    await this.deliveryDateInput.fill(date);
    await this.datePickerOkButton.click();
    await this.page.locator(".dtp").waitFor({ state: "hidden" });

    //await this.deliveryDateInput.press("Tab");
  }

  async selectPaymentType(): Promise<void> {
    await this.paymentTypeRadio.check();
    await this.acceptTermsButton.check();
    await this.nextStepAfterTermsButton.click();
  }

  async checkoutAndSendOrder(): Promise<void> {
    await this.confirmAndSendOrderButton.click();
  }
}
