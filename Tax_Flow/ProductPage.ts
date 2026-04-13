import { Page, expect } from '@playwright/test';

export class ProductPage {
    constructor(private page: Page) {}

    // Retrieves the product name from the current view or popup
    async getProductName(): Promise<string> {
        try {
            // First try to find a header in the View Options popup
            const modalHeader = this.page.locator('h3.modal-title, .product-modal h3, .modal-header h4').first();
            if (await modalHeader.isVisible({ timeout: 3000 })) {
                return (await modalHeader.innerText()).trim();
            }
            
            // Fallback to the main page title
            const mainTitle = this.page.locator('h1.product_title, h1, h2').first();
            return (await mainTitle.innerText()).trim();
        } catch {
            return 'Selected Product';
        }
    }

    // Opens the product options popup — index 0 = first product, 1 = second, etc.
    async clickViewOptions(index: number) {
        const btn = this.page.getByRole('link', { name: 'View Options' }).nth(index);
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click();
    }

    // Selects a product by SKU text, then opens its "View Options" popup.
    async selectProductBySKUAndViewOptions(sku: string, viewOptionsIndex: number) {
        await this.page.getByRole('paragraph').filter({ hasText: sku }).click();
        await this.page.getByText(sku).click();
        await this.clickViewOptions(viewOptionsIndex);
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
