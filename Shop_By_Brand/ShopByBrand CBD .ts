import { Locator, Page } from "@playwright/test";

export class ShopByBrand {
    page: Page;

    // ── Locators ──
    shopByBrandMenuBtn: Locator;
    productCards: Locator;

    constructor(page: Page) {
        this.page = page;

        // Button to open the Shop by Brand menu
        this.shopByBrandMenuBtn = page.getByRole('button', { name: 'Shop by Brand' });

        // Products loaded on brand page
        this.productCards = page.locator('.explore-box');
    }

    // ── Navigation & Actions ────

    /**
     * Opens the main 'Shop by Brand' section
     */
    async openShopByBrandMenu(): Promise<void> {
        await this.shopByBrandMenuBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Hovers over a category icon in the side menu based on its image source
     * @param iconSrcPart Part of the image src attribute (e.g., 'cbdcategoryicon' or 'batteriescategoryicon')
     */
    async hoverCategoryByIcon(iconSrcPart: string): Promise<void> {
        const categoryIcon = this.page.locator(`img[src*="${iconSrcPart}"]`).first();
        await categoryIcon.waitFor({ state: 'visible', timeout: 10000 });
        await categoryIcon.hover();
        // Wait for sub-menu to fully render and stabilise
        await this.page.waitForTimeout(1500);
    }

    /**
     * Hovers over a category icon and clicks a brand link in one motion,
     * keeping the mega-menu open throughout.
     */
    async hoverCategoryAndClickBrand(iconSrcPart: string, hrefPart: string): Promise<void> {
        const categoryIcon = this.page.locator(`img[src*="${iconSrcPart}"]`).first();
        await categoryIcon.waitFor({ state: 'visible', timeout: 10000 });
        
        // Use dispatchEvent for reliable hover in headless/headed mode
        await categoryIcon.dispatchEvent('mouseover');
        await categoryIcon.hover();
        
        // Wait for the sub-menu to fully render
        await this.page.waitForTimeout(2000);

        // Try to find the brand link — it may be CSS-hidden until hover is active
        const brandLink = this.page.locator(`a.font-semibold[href*="${hrefPart}"]`).first();
        
        // Scroll into view and click via JS to bypass any CSS pointer-events: none
        await brandLink.scrollIntoViewIfNeeded();
        await brandLink.dispatchEvent('click');
        await this.page.waitForLoadState('networkidle');
    }

    // ── Direct Navigation ──────

    /**
     * Navigates directly to a brand page by URL (fallback for sticky/hidden sub-menus)
     * @param hrefPart The brand slug (e.g., 'cream-gas')
     */
    async navigateToBrandDirectly(hrefPart: string): Promise<void> {
        await this.page.goto(`https://americandistributorsllc.com/brand/${hrefPart}`);
        await this.page.waitForLoadState('networkidle');
        await this.dismissAgePopUp();
        await this.page.waitForTimeout(1000);
    }


    /**
     * Dismisses the common 'Continue' modal if it appears (Age verification/re-entry)
     */
    async dismissAgePopUp(): Promise<void> {
        const dismissBtn = this.page.getByRole('button', { name: 'Continue' });
        if (await dismissBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await dismissBtn.click();
        }
    }

    /**
     * Waits for products to load correctly for the selected brand
     */
    async waitForProductsToLoad(): Promise<number> {
        try {
            // First wait for existence in DOM
            await this.productCards.first().waitFor({ state: 'attached', timeout: 15000 });
            // Then wait for it to be visible to the user
            await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
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
