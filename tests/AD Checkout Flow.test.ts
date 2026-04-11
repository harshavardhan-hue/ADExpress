import { test, expect } from '@playwright/test';
import { DataManager } from '../AD_Checkout_Flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';
import { PRODUCT_DATA } from '../utils/productData';

// Helper: click a link and wait for the URL to change
async function clickAndNavigate(page: any, locator: any, timeout = 20000) {
    const urlBefore = page.url();
    await locator.click();
    await page.waitForURL((url: URL) => url.toString() !== urlBefore, { timeout });
    await page.waitForLoadState('load', { timeout });
}

test.describe('AD Checkout Flow', () => {
    let poManager: DataManager;

    test('Full End-to-End Checkout Flow', async ({ page, context }) => {
        poManager = new DataManager(page, context);
        const loginPage = poManager.getLoginPage();
        const productPage = poManager.getProductPage();
        const cartPage = poManager.getCartPage();
        const checkoutPage = poManager.getCheckoutPage();

        await test.step('Login to account', async () => {
            console.log('Step: Login to account...');
            await page.goto('/myaccount?tab=login');
            await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);
            
            // Handle the "Continue" modal if it appears
            console.log('Checking for Continue modal...');
            const dismissBtn = page.getByRole('button', { name: 'Continue' });
            await dismissBtn.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
            
            if (await dismissBtn.isVisible()) {
                console.log('Clicking Continue modal...');
                await dismissBtn.click();
                await expect(dismissBtn).not.toBeVisible({ timeout: 10000 });
                console.log('Modal dismissed.');
            }

            // Confirm login by checking for the username
            console.log('Waiting for welcome message...');
            await expect(page.getByText(/utkarshShukla/i).first()).toBeVisible({ timeout: 30000 });
            console.log('Login verified.');
            
            // Go to home to ensure search bar is present
            await page.goto('/');
            await page.waitForLoadState('load');
        });

        await test.step('Search for a product', async () => {
            console.log('Step: Search for a product...');
            await page.waitForTimeout(2000); 
            await productPage.searchProduct(PRODUCT_DATA.validProduct.name);
            
            const productCards = page.locator('a[href*="/product/"]');
            await expect(productCards.first()).toBeVisible({ timeout: 30000 });
            console.log('Search results visible.');
        });

        await test.step('Open product detail page', async () => {
            console.log('Step: Open product detail page...');
            const firstProduct = page.locator('a[href*="/product/"]').first();
            await clickAndNavigate(page, firstProduct);
            await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
        });

        await test.step('Add product to cart', async () => {
            console.log('Step: Add product to cart...');
            // Select quantity of 1 for the first variant to enable the Add to Cart button
            await productPage.setQuantity(1);
            await productPage.addToCart();
            await cartPage.navigateToCart();
            await expect(page.locator('a[href*="/product/"]').first()).toBeVisible({ timeout: 15000 });
        });

        await test.step('Proceed to checkout', async () => {
            console.log('Step: Proceed to checkout...');
            await cartPage.proceedToCheckout();
            await checkoutPage.verifyCheckoutPageLoaded();
        });
    });
});
