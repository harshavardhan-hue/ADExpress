import { test, expect } from '@playwright/test';
import { DataManager } from '../AD_Checkout_Flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';
import { PRODUCT_DATA } from '../utils/productData';

test.describe('E-Commerce Checkout Flow Validation', () => {
    let poManager: DataManager;

    test.beforeEach(async ({ page, context }) => {
        poManager = new DataManager(page, context);
        await page.goto('/myaccount?tab=login');
        await poManager.getLoginPage().login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);
        await page.waitForLoadState('networkidle');
    });

    test('Scenario: Search, Add to Cart, and view Checkout', async ({ page }) => {
        const productPage = poManager.getProductPage();
        const cartPage = poManager.getCartPage();
        const checkoutPage = poManager.getCheckoutPage();

        // 1. Search for a specific product
        await productPage.searchProduct(PRODUCT_DATA.validProduct.name);

        // 2. Select the searched product card
        const firstProduct = page.locator('a[href*="/product/"]').first();
        await firstProduct.click();
        await page.waitForLoadState('networkidle');

        // 3. Increment quantity and add to cart
        await productPage.setQuantity(PRODUCT_DATA.validProduct.quantity);
        await productPage.addToCart();

        // 4. Navigate to Cart
        await cartPage.navigateToCart();
        
        // 5. Click Proceed to Checkout
        await cartPage.proceedToCheckout();

        // 6. Verify Checkout Page components (Safely stopping before Place Order)
        await checkoutPage.verifyCheckoutPageLoaded();
    });
});
