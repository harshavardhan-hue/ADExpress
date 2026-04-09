import { test } from '@playwright/test';
import { DataManager } from '../AD_Checkout_Flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';

test.describe('Banner Link Testing', () => {

    test('Test all banners sequentially in a single browser session', async ({ page, context }) => {
        // 65 banners × ~20s each ≈ 22 min max
        test.setTimeout(1800000);

        const poManager = new DataManager(page, context);
        const loginPage  = poManager.getLoginPage();
        const bannerPage = poManager.getBannerPage();

        // ── 1. Login ──────────────────────────────────────────────────────────
        console.log('[Setup] Logging in...');
        await page.goto('/myaccount?tab=login');
        await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);
        await page.waitForURL('**/', { timeout: 30000 });

        // ── 2. Dismiss modal & wait for home page to fully load ───────────────
        await bannerPage.dismissModal();
        await page.waitForLoadState('networkidle');

        // ── 3. Wait for all banners to render (heavy carousel images) ─────────
        console.log('[Setup] Waiting for all banners to load...');
        await bannerPage.waitForBannersToLoad();

        const totalBanners = await bannerPage.getBannerCount();
        console.log(`[Setup] Found ${totalBanners} banners. Starting test loop...`);

        // ── 4. Iterate through every banner ───────────────────────────────────
        for (let i = 0; i < totalBanners; i++) {
            const { href, sanitizedName } = await bannerPage.getBannerInfo(i);
            const screenshotPath = `screenshots/banner_test_${i + 1}_${sanitizedName}.png`;

            // Wait for the banner to become visible (accounts for slow loaders)
            const isVisible = await bannerPage.waitForBannerVisible(i);
            if (!isVisible) {
                console.warn(`[${i + 1}/${totalBanners}] ❌ FAIL — Banner not visible after retries: ${sanitizedName}`);
                continue;
            }

            console.log(`[${i + 1}/${totalBanners}] Testing: ${sanitizedName} (${href})`);

            try {
                // Click banner link
                await bannerPage.clickBanner(i);

                // Wait for product/category page to fully load (networkidle + buffer)
                await bannerPage.waitForProductPageLoad();

                // Capture screenshot
                await bannerPage.takeScreenshot(screenshotPath);
                console.log(`[${i + 1}/${totalBanners}] ✅ PASS — Screenshot saved`);

                // Navigate back and wait for home page banners to re-render
                await bannerPage.goBackToHome();

            } catch (error: any) {
                console.error(`[${i + 1}/${totalBanners}] ❌ FAIL — ${sanitizedName}: ${error.message || error}`);
                // Recover to home page so the next banner can still be tested
                await bannerPage.recoverToHome();
            }
        }

        console.log('[Done] Banner testing completed.');
    });

});
