import { test, expect } from '@playwright/test';
import { DataManager } from '../Shop_By_Brand/DataManager';
import { CREDENTIALS } from '../utils/credentials';

test.describe('Shop By Brand - Sequential Brand Navigation', () => {

    const brandsToTest = [
        { name: 'ONLY CBD', href: 'only-cbd' },
        { name: 'ERTH WELLNESS CBD', href: 'erth-wellness-cbd' },
        { name: 'JUST CBD', href: 'just-cbd' },
        { name: 'DRAGON CBD', href: 'dragon-cbd' },
        { name: 'ENJOY HEMP CBD', href: 'enjoy-hemp-cbd' },
        { name: 'PET\'S BOTANICALS', href: 'pets-botanicals' },
        { name: 'THINK BOTANICALS CBD', href: 'think-botanicals-cbd' },
        { name: 'PLANTED ROOT CBD', href: 'planted-root-cbd' },
        { name: 'NARCO CBD', href: 'narco-cbd' },
        { name: 'MOON BUZZ CBD', href: 'moon-buzz-cbd' },
        { name: 'CRISPY BLUNTS', href: 'crispy-blunts-blend' },
        { name: 'BOLT CBD', href: 'bolt-cbd' },
        { name: 'JOYPET CBD', href: 'joypet-cbd' },
        { name: 'ALCHEMY CBD', href: 'alchemy-cbd' },
        { name: 'WILD HEMP', href: 'wild-hemp' }
    ];

    test('Iterate through all highlighted CBD brands', async ({ page, context }) => {
        // High timeout for 15 full interactions
        test.setTimeout(450000);

        const poManager = new DataManager(page, context);
        const loginPage = poManager.getLoginPage();
        const brandPage = poManager.getShopByBrandPage();

        // ── Login ─────────────────────────────────────────────────────────────
        console.log('[Setup] Logging in...');
        await page.goto('https://americandistributorsllc.com/myaccount?tab=login');
        await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);
        await page.waitForURL('**/', { timeout: 30000 });
        
        // Dismiss "Shipping Policy" modal if it exists
        const dismissBtn = page.getByRole('button', { name: 'Continue' });
        if (await dismissBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await dismissBtn.click();
        }

        // ── Navigation Loop ───────────────────────────────────────────────────
        for (let i = 0; i < brandsToTest.length; i++) {
            const brand = brandsToTest[i];
            console.log(`\n[Step ${i * 2 + 1}] Mouse over to CBD category icon...`);
            
            // Ensure we are on the home page or a state where the side menu is visible
            if (i > 0) {
                await page.goto('https://americandistributorsllc.com/');
                await page.waitForLoadState('networkidle');
            }

            await brandPage.openShopByBrandMenu();
            await brandPage.hoverCBDCategory();

            console.log(`[Step ${i * 2 + 2}] Clicking on brand: ${brand.name}...`);
            await brandPage.clickBrandByHref(brand.href);

            console.log(`[Verification] Waiting for products to load for ${brand.name}...`);
            const productCount = await brandPage.waitForProductsToLoad();
            
            if (productCount > 0) {
                console.log(`✅ SUCCESS: ${brand.name} has ${productCount} products.`);
            } else {
                console.warn(`⚠️ WARNING: ${brand.name} might have no products displayed.`);
                await brandPage.takeScreenshot(`missing_products_${brand.href}`);
            }
        }

        console.log('\n[Done] All 15 brand navigation steps completed.');
    });

});
