import { Locator, Page } from "@playwright/test";
import * as fs from "fs";

export class BannerPage {
    page: Page;
    banners: Locator;
    continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.banners = page.locator('div.draft-badge-wrapper > a');
        this.continueBtn = page.getByRole('button', { name: 'Continue' });
    }

    // -------------------------------------------------------------------------
    // Wait for all homepage banners to fully render (including heavy images)
    // -------------------------------------------------------------------------
    async waitForBannersToLoad(minCount: number = 50, timeout: number = 60000): Promise<void> {
        await this.page.waitForFunction(
            (min) => document.querySelectorAll('div.draft-badge-wrapper > a').length >= min,
            minCount,
            { timeout }
        );
        // Extra buffer for slow-loading carousel images
        await this.page.waitForTimeout(3000);
    }

    // -------------------------------------------------------------------------
    // Get total banner count
    // -------------------------------------------------------------------------
    async getBannerCount(): Promise<number> {
        return await this.banners.count();
    }

    // -------------------------------------------------------------------------
    // Get the href and sanitized name of a banner by index
    // -------------------------------------------------------------------------
    async getBannerInfo(index: number): Promise<{ href: string; sanitizedName: string }> {
        const banner = this.banners.nth(index);
        const href = (await banner.getAttribute('href')) || `banner_${index}`;
        const sanitizedName =
            href.split('/').pop()?.replace(/[^a-z0-9]/gi, '_') || `banner_${index}`;
        return { href, sanitizedName };
    }

    // -------------------------------------------------------------------------
    // Check whether a banner is visible, retrying for up to maxWaitMs
    // -------------------------------------------------------------------------
    async waitForBannerVisible(index: number, retries: number = 6, intervalMs: number = 3000): Promise<boolean> {
        const banner = this.banners.nth(index);
        for (let attempt = 0; attempt < retries; attempt++) {
            const visible = await banner.isVisible().catch(() => false);
            if (visible) return true;
            console.log(`  Banner ${index + 1} not yet visible, waiting ${intervalMs / 1000}s (attempt ${attempt + 1}/${retries})...`);
            await this.page.waitForTimeout(intervalMs);
        }
        return false;
    }

    // -------------------------------------------------------------------------
    // Click a banner by index, with carousel fallback
    // -------------------------------------------------------------------------
    async clickBanner(index: number): Promise<void> {
        const banner = this.banners.nth(index);
        await banner.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500); // settle after scroll

        try {
            await banner.click({ force: true, timeout: 8000 });
        } catch (e) {
            // Fallback: try clicking the carousel "Next" button, then retry
            const nextBtn = this.page.locator('button:has-text("Next"), button.next').first();
            if (await nextBtn.isVisible()) {
                await nextBtn.click();
                await this.page.waitForTimeout(1500);
                await banner.click({ force: true, timeout: 8000 });
            } else {
                throw e;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Wait for the product/category page to fully load after clicking a banner
    // -------------------------------------------------------------------------
    async waitForProductPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
        await this.page.waitForTimeout(3000); // buffer for heavy product images/loaders
    }

    // -------------------------------------------------------------------------
    // Capture a screenshot of the current (product) page
    // -------------------------------------------------------------------------
    async takeScreenshot(path: string): Promise<void> {
        await this.page.screenshot({ path });
    }

    // -------------------------------------------------------------------------
    // Navigate back to the homepage and wait for banners to re-populate
    // -------------------------------------------------------------------------
    async goBackToHome(): Promise<void> {
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
        await this.waitForBannersToLoad(50, 30000);

        // Dismiss modal if it reappears after back navigation
        if (await this.continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.continueBtn.click();
        }
    }

    // -------------------------------------------------------------------------
    // Dismiss the Shipping Policy modal if present
    // -------------------------------------------------------------------------
    async dismissModal(timeout: number = 10000): Promise<void> {
        try {
            await this.continueBtn.waitFor({ state: 'visible', timeout });
            await this.continueBtn.click();
        } catch (e) {
            // Modal not present — this is fine
        }
    }

    // -------------------------------------------------------------------------
    // Recover navigation back to the home page after a failed banner click
    // -------------------------------------------------------------------------
    async recoverToHome(): Promise<void> {
        try {
            await this.page.goto('/');
            await this.page.waitForLoadState('networkidle');
            await this.waitForBannersToLoad(50, 30000);
        } catch (_) {}
    }

    // -------------------------------------------------------------------------
    // Helper: check if a screenshot file already exists
    // -------------------------------------------------------------------------
    screenshotExists(path: string): boolean {
        return fs.existsSync(path);
    }
}
