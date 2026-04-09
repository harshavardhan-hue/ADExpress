import { Locator, Page } from "@playwright/test";

export class HomePage {
    page: Page;
    banners: Locator;

    constructor(page: Page) {
        this.page = page;
        // Target promotional banners as identified in exploration
        this.banners = page.locator('div.draft-badge-wrapper > a');
    }

    async getBannerCount(): Promise<number> {
        return await this.banners.count();
    }

    async clickBanner(index: number) {
        await this.banners.nth(index).click();
        await this.page.waitForLoadState('networkidle');
    }

    async goBack() {
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle');
    }

    async takeBannerScreenshot(bannerName: string) {
        await this.page.screenshot({ path: `screenshots/banner_${bannerName}.png`, fullPage: true });
    }
}
