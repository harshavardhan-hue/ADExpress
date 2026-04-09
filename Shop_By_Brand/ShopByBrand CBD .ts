import { Locator, Page } from "@playwright/test";

export class ShopByBrand {
    page: Page;

    // ── Locators ──────────────────────────────────────────────────────────────
    shopByBrandMenuBtn: Locator;
    cbdCategoryIcon: Locator;
    productCards: Locator;

    constructor(page: Page) {
        this.page = page;

        // Button to open the Shop by Brand menu
        this.shopByBrandMenuBtn = page.getByRole('button', { name: 'Shop by Brand' });
        
        // The specific CBD category icon user provided
        this.cbdCategoryIcon = page.locator('img[src*="cbdcategoryicon.png"]').first();

        // Products loaded on brand page
        this.productCards = page.locator('.product, .product-card, article.type-product, .product-wrap, .products li');
    }

    // ── Navigation & Actions ──────────────────────────────────────────────────

    /**
     * Opens the main 'Shop by Brand' section
     */
    async openShopByBrandMenu(): Promise<void> {
        await this.shopByBrandMenuBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Hovers over the CBD category icon in the side menu
     */
    async hoverCBDCategory(): Promise<void> {
        await this.cbdCategoryIcon.waitFor({ state: 'visible' });
        await this.cbdCategoryIcon.hover();
        // Give a brief moment for the sub-menu to settle
        await this.page.waitForTimeout(1000);
    }

    /**
     * Clicks a brand link based on its partial href (e.g., 'only-cbd')
     */
    async clickBrandByHref(hrefPart: string): Promise<void> {
        const brandLink = this.page.locator(`a.font-semibold[href*="${hrefPart}"]`).first();
        await brandLink.waitFor({ state: 'visible' });
        await brandLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    // ── Verification ──────────────────────────────────────────────────────────

    /**
     * Waits for products to load correctly for the selected brand
     */
    async waitForProductsToLoad(): Promise<number> {
        try {
            await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 });
            return await this.productCards.count();
        } catch {
            return 0; // Timed out or no products
        }
    }

    /**
     * Take a screenshot for report/debugging
     */
    async takeScreenshot(fileName: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${fileName}.png` });
    }
}
