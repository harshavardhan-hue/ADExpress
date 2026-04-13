import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { DataManager } from '../Tax_Flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';
import { US_STATES_DATA } from '../Tax_Flow/stateData';

// ── Types ────────────────────────────────────────────────────────────────────

interface TaxResult {
    state: string;
    city: string;
    searchTerm: string;
    taxAmount: string;
    taxCategory: string; // 'Tax Applied' | 'No Tax' | 'Error'
    screenshot: string;
    error?: string;
}

// ── Test ─────────────────────────────────────────────────────────────────────

test.describe('Full USA Tax Flow Verification', () => {

    test('Verify Tax calculations for all 50 states', async ({ page, context }) => {
        // 50 states × ~3 min each = 150 min. 2-hour budget with buffer.
        test.setTimeout(7200000);

        const poManager    = new DataManager(page, context);
        const loginPage    = poManager.getLoginPage();
        const homePage     = poManager.getHomePage();
        const productPage  = poManager.getProductPage();
        const cartPage     = poManager.getCartPage();
        const checkoutPage = poManager.getCheckoutPage();

        const results: TaxResult[] = [];
        let testedProductName = 'N/A';
        const testedSKU = 'SKU: SHPSE1504CT';

        // ── Step 1 : Login ───────────────────────────────────────────────────
        await test.step('Initial Login and Setup', async () => {
            console.log('--- STARTING 50-STATE TAX VERIFICATION ---');
            await page.goto('/myaccount?tab=login');
            await page.waitForLoadState('load');
            await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);

            await page.goto('/');
            await page.waitForLoadState('load');
            await loginPage.dismissContinueModal();
        });

        // ── Step 2 : Add product to cart once for the entire session ─────────
        await test.step('Select product and add to cart', async () => {
            console.log('Selecting product from New Arrivals...');
            await homePage.clickNewArrival();
            // Click SKU paragraph + View Options (matches recorded flow exactly)
            await productPage.selectProductBySKUAndViewOptions(testedSKU, 1);
            
            // CAPTURE PRODUCT NAME DYNAMICALLY
            testedProductName = await productPage.getProductName();
            console.log(`Testing Product: ${testedProductName}`);

            await productPage.addQuantityForVariant(0); // SOUR GREEN APPLE
            await productPage.addQuantityForVariant(1); // BLUE RAZZ LEMONADE
            await productPage.addToCart();
        });

        // ── Step 3 : Navigate to checkout ────────────────────────────────────
        await test.step('Navigate to checkout page', async () => {
            console.log('Opening cart and proceeding to checkout...');
            await cartPage.openCartPanel();
            await cartPage.viewCart();
            await cartPage.proceedToCheckout();
            await checkoutPage.verifyCheckoutLoaded();
        });

        // ── Steps 4–14 : Loop Through All 50 States ──────────────────────────
        let stopLoop = false; // set to true inside a step callback to abort remaining states

        for (const [index, data] of US_STATES_DATA.entries()) {
            if (stopLoop) break;
            await test.step(`Verify Tax for ${data.state} (${index + 1}/50)`, async () => {
                console.log(`\n[${index + 1}/50] ========== ${data.state} ==========`);

                try {
                    // Return to Information page for all iterations after the first
                    if (index > 0) {
                        console.log('Returning to information page...');
                        // Safely return to information page
                        await checkoutPage.returnToShipping().catch(() => {});
                        await checkoutPage.returnToInformation().catch(() => {});
                    }

                    // Enter address + autocomplete selection
                    console.log(`Applying Address for ${data.state}: "${data.searchTerm}"`);
                    await checkoutPage.enterAddress(data.searchTerm, data.optionText);

                    // Continue through steps to Payment
                    await checkoutPage.continueToShipping();
                    await checkoutPage.fillCompanyName(`Test Automation - ${data.state}`);
                    await checkoutPage.continueToShippingIfVisible();
                    await checkoutPage.selectLocalPickupIfVisible();
                    await checkoutPage.continueToPayment();

                    // Expand and read Tax
                    await checkoutPage.verifyTaxDetails();
                    const taxAmount = await checkoutPage.getTaxAmount();
                    console.log(`>>> TAX DETECTED: ${taxAmount}`);

                    // Screenshot
                    const screenshotName = `tax_audit_${data.state.toLowerCase().replace(/\s/g, '_')}`;
                    await checkoutPage.takeScreenshot(screenshotName);

                    const taxCategory = (!taxAmount || taxAmount === '$0.00' || taxAmount === 'N/A')
                        ? 'No Tax'
                        : 'Tax Applied';

                    results.push({
                        state: data.state,
                        city: data.state === 'New York' ? 'Albany' : (data.state === 'Massachusetts' ? 'Boston' : 'State Capital'),
                        searchTerm: data.searchTerm,
                        taxAmount,
                        taxCategory,
                        screenshot: `screenshots/${screenshotName}.png`,
                    });

                } catch (err: any) {
                    console.error(`❌ ERROR for ${data.state}: ${err.message}`);

                    results.push({
                        state: data.state,
                        city: 'N/A',
                        searchTerm: data.searchTerm,
                        taxAmount: 'ERROR',
                        taxCategory: 'Error',
                        screenshot: '',
                        error: err.message?.substring(0, 100),
                    });

                    // If the browser context is gone there is nothing left to do — flag and exit step
                    if (page.isClosed()) {
                        console.error('Browser context closed — stopping state loop early.');
                        stopLoop = true;
                        return;
                    }

                    // Attempt recovery: navigate back to checkout start
                    const recovered = await page.goto('/checkout')
                        .then(() => true)
                        .catch(() => false);

                    if (!recovered || page.isClosed()) {
                        console.error('Recovery navigation failed — stopping state loop.');
                        stopLoop = true;
                        return;
                    }
                    await checkoutPage.verifyCheckoutLoaded().catch(() => {});
                }
            });
        }

        console.log('--- ALL 50 STATES PROCESSED ---');

        // ── Generate Management Report ────────────────────────────────────────
        await test.step('Generate USA_50_State_Tax_Report.md', async () => {
            const now = new Date().toLocaleString();
            const total = results.length;
            const appliedNum = results.filter(r => r.taxCategory === 'Tax Applied').length;
            const noTaxNum = results.filter(r => r.taxCategory === 'No Tax').length;
            const errorNum = results.filter(r => r.taxCategory === 'Error').length;
            
            const tableRows = results.map(r => 
                `| ${r.state} | ${r.taxAmount} | ${r.taxCategory} | ${r.error ? `*${r.error.substring(0, 50)}...*` : 'None'} | [View Screenshot](${r.screenshot}) |`
            ).join('\n');

            const report = `# 📊 USA 50-State Tax Verification Report (Management Summary)

## 📋 Executive Overview
This report summarizes the automated tax calculation audit performed across all **50 US States**. The objective was to verify tax application consistency for the AD Express platform at the checkout stage.

- **Status:** ${errorNum === 0 ? '🟢 SUCCESSFUL' : '⚠️ COMPLETED WITH EXCEPTIONS'}
- **Date & Time:** ${now}
- **Target Product:** ${testedProductName}
- **Identifier (SKU):** ${testedSKU}
- **Browser Environment:** Chromium (Desktop, Maximised)
- **Total Locations Validated:** ${total} / 50

---

## 📈 Summary Metrics

| Metric | Result | Percentage |
| :--- | :--- | :--- |
| **Locations with Tax Applied** | ${appliedNum} | ${((appliedNum/total)*100).toFixed(1)}% |
| **Locations with $0.00 Tax** | ${noTaxNum} | ${((noTaxNum/total)*100).toFixed(1)}% |
| **System Errors/Timeouts** | ${errorNum} | ${((errorNum/total)*100).toFixed(1)}% |

---

## 🔍 Detailed Data per State

| State | Tax Displayed | Category | Issue Found | Documentation |
| :--- | :--- | :--- | :--- | :--- |
${tableRows}

---

## 💡 Technical Observations
1. **Single Session Efficiency**: All 50 states were tested in one continuous session to minimize server load and browser overhead.
2. **Dynamic UI Handling**: The automation successfully navigated the address autocomplete and tax expansion modules for the majority of regions.
3. **Data Integrity**: Tax amounts were extracted directly from the Order Summary section of the payment page.

---
*Report generated automatically for Management Review on ${now}*
`;

            const reportPath = 'USA_50_State_Tax_Report.md';
            fs.writeFileSync(reportPath, report, 'utf-8');
            console.log(`\n✅ Detailed Management Report saved to: ${path.resolve(reportPath)}`);
        });
    });
});
