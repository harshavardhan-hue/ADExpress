import { Page } from '@playwright/test';

export class HomePage {
    constructor(private page: Page) {}

    async clickNewArrival() {
        await this.page.locator('#GifHeader').first().click();
        await this.page.waitForLoadState('load');

        // Dismiss "Please login to see the data" popup if it appears
        const loginPopupOk = this.page.getByRole('button', { name: 'OK' });
        if (await loginPopupOk.isVisible({ timeout: 5000 }).catch(() => false)) {
            await loginPopupOk.click();
        }
    }
}
