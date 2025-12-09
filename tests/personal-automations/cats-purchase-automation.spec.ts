import { expect, test } from "@playwright/test";
import { CatStorePage } from "../page-objects/cats-pom";
import { getNextValidDeliveryDate } from "../common/helpers/date-helper";

test.describe("Purchase my cats litter", () => {
  test("I can purchase my cats litter", async ({ page }) => {
    const catStorePage = new CatStorePage(page);
    const email = process.env.CAT_STORE_EMAIL!;
    const password = process.env.CAT_STORE_PASSWORD!;
    const deliveryDate = getNextValidDeliveryDate();

    await test.step("Open homepage", async () => {
      await catStorePage.open();
    });

    await test.step("Open login form", async () => {
      await catStorePage.clickOnLoginButton();
    });

    await test.step("Authenticate user with valid credentials", async () => {
      await catStorePage.login(email, password);
      await expect(page.getByRole("link", { name: "Ivonne" })).toBeVisible();
    });

    await test.step("Open Cats category from main menu", async () => {
      await catStorePage.clickOnCatMenuButton();
    });

    await test.step("Navigate to Cat Litter subcategory", async () => {
      await catStorePage.clickOnCatsLitter();
    });

    await test.step("Select preferred litter brand (JvCats)", async () => {
      await catStorePage.clickOnPreferredLitterBrand();
      await expect(page).toHaveURL(/jvcats/i);
    });

    await test.step("Choose lavender fragrance litter", async () => {
      await catStorePage.clickOnLavenderLitterFragrance();
    });

    await test.step("Select 5kg product size", async () => {
      await catStorePage.selectJvCatsLavanda5kg();
      await expect(catStorePage.addToCartButton).toBeEnabled();
    });

    await test.step("Add product to shopping cart", async () => {
      await catStorePage.clickOnAddToCartButton();
    });

    await test.step("Go to checkout from shopping cart", async () => {
      await catStorePage.clickFinalizeOrder();
      await catStorePage.clickOnNextStepButton();
      await expect(page).toHaveURL(/paso-2/);
    });

    await test.step("Choose valid delivery date (no Sundays/holidays)", async () => {
      await catStorePage.setDeliveryDate(deliveryDate);
    });

    await test.step("Select payment method and accept terms", async () => {
      await catStorePage.selectPaymentType();
    });

    /* await test.step("Confirm purchase and submit final order", async () => {
      await catStorePage.checkoutAndSendOrder();
        await expect(page.getByRole('heading', { name: '¡Tu orden ha sido registrada' })).toBeVisible();
    }); */

    await test.step("Attach final screenshot", async () => {
      await test.info().attach("Final Order", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    });
  });
});
