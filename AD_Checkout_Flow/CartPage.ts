import { Locator, Page, expect } from "@playwright/test";

export class CartPage {
    page: Page;
    proceedToCheckoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.proceedToCheckoutBtn = page.getByRole('link', { name: /Proceed to Checkout/i })
            .or(page.getByRole('button', { name: /Proceed to Checkout/i }))
            .or(page.locator('a[href="/checkout"]'))
            .or(page.locator('text=Proceed to Checkout'));
    }

    async navigateToCart() {
        await this.page.goto('/cart');
        await this.page.waitForLoadState('networkidle');
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutBtn.first().click();
        await this.page.waitForLoadState('networkidle');
    }
}
