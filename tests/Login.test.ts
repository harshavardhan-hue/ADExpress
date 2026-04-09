import { test, expect } from '@playwright/test';
import { DataManager } from '../AD_Checkout_Flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';

test.describe('AD Express Login Automation', () => {
    let poManager: DataManager;

    test.beforeEach(async ({ page, context }) => {
        poManager = new DataManager(page, context);
        
        // Navigate to the American Distributor LLC login page
        await page.goto('/myaccount?tab=login'); 
    });

    test('Scenario: Login using Page Object Model', async ({ page }) => {
        const loginPage = poManager.getLoginPage();

        await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);

        // Wait for login to process and page to load
        await page.waitForLoadState('networkidle');

        // Take a screenshot of the home page
        await page.screenshot({ path: 'screenshots/homepage_screenshot.png', fullPage: true });

        // Add assertions for successful login (update with American Distributor LLC element)
        // TODO: Replace with the exact assertion after we know the element to verify
        // await expect(page.getByText('Welcome to American Distributor LLC')).toBeVisible(); 
    });
});
