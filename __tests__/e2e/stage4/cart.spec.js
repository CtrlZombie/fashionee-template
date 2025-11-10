import { test, expect } from "@playwright/test";

test.describe("Stage 4 — Корзина", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("cart-btn").click();
    await expect(page.getByTestId("cart-page")).toBeVisible();
  });

  test("В корзине отображаются добавленные товары", async ({ page }) => {
    await page.getByTestId("shop-btn").click();

    const firstProduct = page.getByTestId("product-card").first();
    const firstProductName = await firstProduct.getAttribute("data-name");
    await firstProduct.getByTestId("add-to-cart-btn").click();

    const fourthProduct = page.getByTestId("product-card").nth(4);
    const fourthProductName = await fourthProduct.getAttribute("data-name");
    await fourthProduct.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-btn").click();

    const items = page.getByTestId("cart-item");
    const count = await items.count();
    expect(count).toBe(2);

    const cartNames = [];
    for (let i = 0; i < count; i++) {
      const name = await items.nth(i).getAttribute("data-name");
      cartNames.push(name);
    }

    expect(cartNames).toContain(firstProductName);
    expect(cartNames).toContain(fourthProductName);
  });

  test("Удаление товара из корзины работает корректно", async ({ page }) => {
    await page.getByTestId("shop-btn").click();

    const secondProduct = page.getByTestId("product-card").nth(2);
    await secondProduct.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-btn").click();
    let items = page.getByTestId("cart-item");
    expect(await items.count()).toBe(1);

    await items.first().getByTestId("remove-from-cart-btn").click();

    items = page.getByTestId("cart-item");
    expect(await items.count()).toBe(0);

    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });

  test("Изменение количества товара пересчитывает Order price", async ({
    page,
  }) => {
    await page.getByTestId("shop-btn").click();

    const secondProduct = page.getByTestId("product-card").nth(2);
    await secondProduct.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-btn").click();

    const item = page.getByTestId("cart-item").first();
    const price = await item.getAttribute("data-price");

    await item.getByTestId("increase-cart-btn").click();

    const orderPrice = await page.getByTestId("order-price").textContent();
    expect(Number(orderPrice)).toBe(Number(price) * 2);

    await item.getByTestId("decrease-cart-btn").click();
    const orderPriceBack = await page.getByTestId("order-price").textContent();
    expect(Number(orderPriceBack)).toBe(Number(price));
  });

  test("Удаление товара обновляет Order price", async ({ page }) => {
    await page.getByTestId("shop-btn").click();

    const firstProduct = page.getByTestId("product-card").first();
    await firstProduct.getByTestId("add-to-cart-btn").click();

    const secondProduct = page.getByTestId("product-card").nth(2);
    await secondProduct.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-btn").click();

    const orderPriceBefore = Number(
      await page.getByTestId("order-price").textContent()
    );

    const item = page.getByTestId("cart-item").first();
    const itemPrice = Number(await item.getAttribute("data-price"));

    await item.getByTestId("remove-from-cart-btn").click();

    const orderPriceAfter = Number(
      await page.getByTestId("order-price").textContent()
    );

    expect(orderPriceAfter).toBe(
      Number((orderPriceBefore - itemPrice).toFixed(2))
    );
  });

  test("Применение промокода 'ilovereact' даёт скидку 10%", async ({
    page,
  }) => {
    await page.getByTestId("shop-btn").click();

    const firstProduct = page.getByTestId("product-card").first();
    await firstProduct.getByTestId("add-to-cart-btn").click();

    const thirdProduct = page.getByTestId("product-card").nth(2);
    await thirdProduct.getByTestId("add-to-cart-btn").click();

    await page.getByTestId("cart-btn").click();

    const orderPrice = Number(
      await page.getByTestId("order-price").textContent()
    );

    await page.getByTestId("promo-code-input").fill("ilovereact");
    await page.getByTestId("apply-promo-btn").click();

    const discountText = await page.getByTestId("discount").textContent();
    expect(discountText).toBe("10%");

    const orderPriceWithDiscount = +(orderPrice * 0.9).toFixed(2);

    const total = Number(await page.getByTestId("total-price").textContent());
    const delivery = 15;
    expect(total).toBe(orderPriceWithDiscount + delivery);
  });

  test("Удаление или неверный промокод убирает скидку", async ({ page }) => {
    await page.getByTestId("shop-btn").click();

    const firstProduct = page.getByTestId("product-card").first();
    await firstProduct.getByTestId("add-to-cart-btn").click();
    await page.getByTestId("cart-btn").click();

    await page.getByTestId("promo-code-input").fill("ilovereact");
    await page.getByTestId("apply-promo-btn").click();

    let discountText = await page.getByTestId("discount").textContent();
    expect(discountText).toBe("10%");

    await page.getByTestId("promo-code-input").fill("");
    await page.getByTestId("apply-promo-btn").click();

    discountText = await page.getByTestId("discount").textContent();
    expect(discountText.toLowerCase()).toContain("no");

    await page.getByTestId("promo-code-input").fill("wrongcode");
    await page.getByTestId("apply-promo-btn").click();

    discountText = await page.getByTestId("discount").textContent();
    expect(discountText.toLowerCase()).toContain("no");
  });

  test("По клику на Checkout в консоль выводятся данные заказа", async ({
    page,
  }) => {
    await page.getByTestId("shop-btn").click();
    const firstProduct = page.getByTestId("product-card").first();
    await firstProduct.getByTestId("add-to-cart-btn").click();
    await page.getByTestId("cart-btn").click();
    const [message] = await Promise.all([
      page.waitForEvent("console"),
      page.getByTestId("checkout-btn").click(),
    ]);

    const text = message.text();
    expect(text).toContain("Your order:"); // например, внутри должен быть JSON с заказом
  });
});
