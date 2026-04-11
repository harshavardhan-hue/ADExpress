import { Page } from '@playwright/test';

export class ProductPage {
    constructor(private page: Page) {}

    // Selects a product by SKU text, then opens its "View Options" popup.
    // Matches the original recorded flow:
    //   1. Click the paragraph containing the SKU
    //   2. Click the SKU text itself (confirms selection)
    //   3. Click "View Options" (nth index)
    async selectProductBySKUAndViewOptions(sku: string, viewOptionsIndex: number) {
        await this.page.getByRole('paragraph').filter({ hasText: sku }).click();
        await this.page.getByText(sku).click();
        const btn = this.page.getByRole('link', { name: 'View Options' }).nth(viewOptionsIndex);
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click();
    }

    // Clicks the '+' button for a specific variant row — variantIndex 0 = first row, 1 = second, etc.
    async addQuantityForVariant(variantIndex: number) {
        const btn = this.page.getByRole('button', { name: '+' }).nth(variantIndex);
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click();
    }

    async addToCart() {
        await this.page.getByRole('button', { name: 'Add to cart' }).click();
    }
}
