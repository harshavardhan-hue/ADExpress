import { test } from '@playwright/test';
import { DataManager } from '../AD_Checkout_Flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';

test('Banner Discovery', async ({ page, context }) => {
    const poManager = new DataManager(page, context);
    const bannerPage = poManager.getBannerPage();

    await page.goto('/myaccount?tab=login');
    await poManager.getLoginPage().login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);
    await page.waitForURL('**/', { timeout: 30000 });

    // Handle modal
    await bannerPage.dismissModal();

    // Wait for all banners to load
    await bannerPage.waitForBannersToLoad();

    const count = await bannerPage.getBannerCount();

    console.log(`BANNERS_DISCOVERED_START`);
    for (let i = 0; i < count; i++) {
        const { href, sanitizedName } = await bannerPage.getBannerInfo(i);
        console.log(`${i + 1}: [${sanitizedName}] → ${href}`);
    }
    console.log(`BANNERS_DISCOVERED_END`);
    console.log(`Total banners discovered: ${count}`);
});
