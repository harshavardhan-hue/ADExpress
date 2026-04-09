import { Locator, Page, expect } from "@playwright/test";

export class CheckoutPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async verifyCheckoutPageLoaded() {
        // Look for typical checkout fields or headings indicating the checkout process is active
        await expect(this.page.getByRole('heading', { name: /Shipping Address/i }).first()).toBeVisible({ timeout: 15000 });
    }
}
