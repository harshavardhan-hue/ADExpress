import { test, expect } from '@playwright/test';
import { DataManager } from '../Shipping tax flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';

test.describe('Shipping Tax Flow', () => {

    test('Verify Tax changes based on Delivery Address', async ({ page, context }) => {
        test.setTimeout(300000); // 5 minutes for this complex E2E flow
        const poManager  = new DataManager(page, context);
        const loginPage  = poManager.getLoginPage();
        const homePage   = poManager.getHomePage();
        const productPage  = poManager.getProductPage();
        const cartPage   = poManager.getCartPage();
        const checkoutPage = poManager.getCheckoutPage();

        // ── Steps 1-4 : Navigate & Login ─────────────────────────────────────
        await test.step('Step 1-4: Navigate to website and login', async () => {
            console.log('Navigating to login page...');
            await page.goto('/myaccount?tab=login');
            await page.waitForLoadState('load');
            
            console.log('Logging in...');
            await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);

            // Navigate to home page explicitly after login to ensure correct landing
            console.log('Navigating to home page...');
            await page.goto('/');
            await page.waitForLoadState('load');

            // Dismiss the Shipping Policy "Continue" modal on the home page
            console.log('Checking for Shipping Policy modal...');
            await loginPage.dismissContinueModal();
        });

        // ── Step 5 : Click on New Arrival ─────────────────────────────────────
        await test.step('Step 5: Click on New Arrival', async () => {
            console.log('Clicking on New Arrival...');
            await homePage.clickNewArrival();
        });

        // ── Steps 6-7 : Select product and add quantity for 2 variants ────────
        await test.step('Step 6-7: Select product and add quantity', async () => {
            console.log('Selecting product by SKU and opening View Options...');
            // Click SKU paragraph first, then View Options — matches original recording exactly
            await productPage.selectProductBySKUAndViewOptions('SKU: SHPSE1504CT', 1);
            console.log('Adding quantities for variants...');
            await productPage.addQuantityForVariant(0);           // SOUR GREEN APPLE
            await productPage.addQuantityForVariant(1);           // BLUE RAZZ LEMONADE
        });

        // ── Step 8 : Add to Cart ──────────────────────────────────────────────
        await test.step('Step 8: Add to cart', async () => {
            console.log('Adding to cart...');
            await productPage.addToCart();
        });

        // ── Step 9 : Open Cart panel ──────────────────────────────────────────
        await test.step('Step 9: Click on Cart', async () => {
            console.log('Opening cart panel...');
            await cartPage.openCartPanel();
        });

        // ── Step 10 : View Cart ───────────────────────────────────────────────
        await test.step('Step 10: Click on View Cart', async () => {
            console.log('Viewing cart...');
            await cartPage.viewCart();
        });

        // ── Step 11 : Proceed to Checkout ─────────────────────────────────────
        await test.step('Step 11: Proceed to Checkout', async () => {
            console.log('Proceeding to checkout...');
            await cartPage.proceedToCheckout();
            console.log('Verifying checkout loaded...');
            await checkoutPage.verifyCheckoutLoaded();
        });

        // ── Steps 12-13 : Address 1 — Nashua Street, Boston MA ───────────────
        await test.step('Step 12-13: Enter Address 1 (Nashua Street, Boston, MA)', async () => {
            console.log('Entering Address 1 (Boston, MA)...');
            await checkoutPage.enterAddress('Nashua ', 'Nashua Street, Boston, MA, USA');
            console.log('Continuing to shipping...');
            await checkoutPage.continueToShipping();              // first click — may surface Company Name field
            console.log('Filling company name...');
            await checkoutPage.fillCompanyName('TEST');
            console.log('Continuing to shipping again...');
            await checkoutPage.continueToShipping();              // second click — proceed to shipping step
            console.log('Selecting Local Pickup...');
            await checkoutPage.selectLocalPickup();               // select Local Pickup shipping method
            console.log('Continuing to payment...');
            await checkoutPage.continueToPayment();
        });

        // ── Step 13 (cont) + Step 14 : Check Tax & Screenshot ─────────────────
        await test.step('Step 13-14: Verify Tax for Boston MA and take screenshot', async () => {
            console.log('Verifying tax details for Boston...');
            await checkoutPage.verifyTaxDetails();
            console.log('Taking screenshot for Boston tax...');
            await checkoutPage.takeScreenshot('tax_boston_ma');
        });

        // ── Steps 15 : Return to Information page ────────────────────────────
        await test.step('Step 15: Return to Information page', async () => {
            await checkoutPage.returnToShipping();
            await checkoutPage.returnToInformation();
        });

        // ── Steps 16-17 : Address 2 — New Lots Avenue, Brooklyn NY ───────────
        await test.step('Step 16-17: Enter Address 2 (New Lots Avenue, Brooklyn, NY)', async () => {
            await checkoutPage.enterAddress('new ', 'New Lots Avenue, Brooklyn, NY');
            await checkoutPage.continueToShipping();
            await checkoutPage.continueToPayment();
        });

        // ── Step 17 (cont) + Step 18 : Check Tax & Screenshot ─────────────────
        await test.step('Step 17-18: Verify Tax for Brooklyn NY and take screenshot', async () => {
            await checkoutPage.verifyTaxDetails();
            await checkoutPage.takeScreenshot('tax_brooklyn_ny');
        });

        // ── Cleanup : Return to Information ───────────────────────────────────
        await test.step('Return to Information page', async () => {
            await checkoutPage.returnToShipping();
            await checkoutPage.returnToInformation();
        });

    });

});
