import { Page } from '@playwright/test';

export class CartPage {
    constructor(private page: Page) {}

    // Opens the mini cart panel in the header
    async openCartPanel() {
        await this.page.getByRole('button', { name: 'cart', exact: true }).click();
    }

    // Clicks VIEW CART inside the mini cart panel
    async viewCart() {
        await this.page.getByRole('button', { name: 'VIEW CART' }).click();
    }

    // Clicks PROCEED TO CHECKOUT on the cart page
    async proceedToCheckout() {
        await this.page.waitForTimeout(3000);

        // Dismiss "Shipping Policy Updated" modal — wait for it to appear, then click Continue
        const continueBtn = this.page.getByRole('button', { name: 'Continue' });
        await continueBtn.waitFor({ state: 'visible', timeout: 12000 }).catch(() => {});
        if (await continueBtn.isVisible()) {
            await continueBtn.click();
            // Wait for the modal to fully disappear before proceeding
            await continueBtn.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        }

        // Wait for the blur loading overlay (z-9999 spinner) to disappear
        await this.page.waitForFunction(
            () => !document.querySelector('[class*="backdrop-blur-md"]'),
            { timeout: 20000 }
        ).catch(() => {});

        // Use JavaScript click to bypass any residual DOM-level overlay
        const checkoutBtn = this.page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
        await checkoutBtn.waitFor({ state: 'visible', timeout: 10000 });
        await checkoutBtn.evaluate((el: HTMLElement) => el.click());

        // Wait for navigation to the checkout page (fixed wait — no waitForLoadState)
        await this.page.waitForTimeout(5000);
    }
}
