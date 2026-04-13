import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { DataManager } from '../Tax_Flow/DataManager';
import { CREDENTIALS } from '../utils/credentials';

// ─────────────────────────────────────────────────────────────────────────────
// 5-STATE TAX AUDIT
// Product : SHPSE1504CT  (SOUR GREEN APPLE + BLUE RAZZ LEMONADE variants)
// States  : Massachusetts · New York · Texas · California · Florida
// ─────────────────────────────────────────────────────────────────────────────

interface TaxResult {
    no:           number;
    state:        string;
    stateCode:    string;
    city:         string;
    addressUsed:  string;
    product:      string;
    sku:          string;
    taxAmount:    string;
    taxCategory:  string;   // 'Tax Applied' | 'No Tax' | 'Error'
    screenshotFile: string;
    status:       string;   // 'PASS' | 'FAIL'
    errorNote:    string;
}

// 5 representative states — address number + street that Google Places knows
const STATES = [
    {
        state: 'Massachusetts', code: 'MA', city: 'Boston',
        search: 'Nashua Street Boston',
        option: 'Nashua Street, Boston, MA, USA',
    },
    {
        state: 'New York', code: 'NY', city: 'Albany',
        search: 'State St Washington Ave Albany NY',
        option: 'State Street, Albany, NY, USA',
    },
    {
        state: 'Texas', code: 'TX', city: 'Austin',
        search: '1100 Congress Avenue Austin TX',
        option: '1100 Congress Avenue, Austin, TX, USA',
    },
    {
        state: 'California', code: 'CA', city: 'Sacramento',
        search: '1315 10th Street Sacramento CA',
        option: '1315 10th Street, Sacramento, CA, USA',
    },
    {
        state: 'Florida', code: 'FL', city: 'Tallahassee',
        search: '400 S Monroe Street Tallahassee FL',
        option: '400 S Monroe Street, Tallahassee, FL, USA',
    },
];

const SKU          = 'SKU: SHPSE1504CT';
const PRODUCT_NAME = 'SHPSE 1504CT';   // fallback — overwritten dynamically
const VARIANTS     = ['SOUR GREEN APPLE', 'BLUE RAZZ LEMONADE'];

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Tax Audit — 5 US States', () => {

    test('Verify Tax for MA · NY · TX · CA · FL', async ({ page, context }) => {
        test.setTimeout(1800000); // 30 min — 5 states × ~5 min each + buffer

        const dm          = new DataManager(page, context);
        const loginPage   = dm.getLoginPage();
        const homePage    = dm.getHomePage();
        const productPage = dm.getProductPage();
        const cartPage    = dm.getCartPage();
        const checkout    = dm.getCheckoutPage();

        const results: TaxResult[]  = [];
        let   productName           = PRODUCT_NAME;
        let   stopLoop              = false;
        const startTime             = new Date();

        // ── 1. Login ──────────────────────────────────────────────────────────
        await test.step('Login', async () => {
            console.log('\n========== TAX AUDIT : 5 STATES ==========');
            await page.goto('/myaccount?tab=login');
            await page.waitForLoadState('load');
            await loginPage.login(CREDENTIALS.validUser.username, CREDENTIALS.validUser.password);
            await page.goto('/');
            await page.waitForLoadState('load');
            await loginPage.dismissContinueModal();
            console.log('✅  Login successful');
        });

        // ── 2. Add product to cart (done once for all states) ─────────────────
        await test.step('Select product & add to cart', async () => {
            await homePage.clickNewArrival();
            await productPage.selectProductBySKUAndViewOptions(SKU, 1);

            // Capture the live product name
            productName = await productPage.getProductName();
            console.log(`✅  Product selected: ${productName}  (${SKU})`);

            await productPage.addQuantityForVariant(0);   // SOUR GREEN APPLE
            await productPage.addQuantityForVariant(1);   // BLUE RAZZ LEMONADE
            await productPage.addToCart();
            console.log(`✅  Variants added: ${VARIANTS.join(' + ')}`);
        });

        // ── 3. Navigate to checkout ────────────────────────────────────────────
        await test.step('Proceed to checkout', async () => {
            await cartPage.openCartPanel();
            await cartPage.viewCart();
            await cartPage.proceedToCheckout();
            await checkout.verifyCheckoutLoaded();
            console.log('✅  Checkout page loaded');
        });

        // ── 4. State loop ──────────────────────────────────────────────────────
        for (const [i, st] of STATES.entries()) {
            if (stopLoop) break;

            await test.step(`Tax check ${i + 1}/5 — ${st.state} (${st.code})`, async () => {
                console.log(`\n---------- [${i + 1}/5] ${st.state} (${st.code}) ----------`);

                try {
                    // For states after the first, navigate via cart → PROCEED TO CHECKOUT
                    // Must use waitUntil:'domcontentloaded' — the site's background
                    // requests prevent the default 'load' event from ever firing.
                    if (i > 0) {
                        if (page.isClosed()) { stopLoop = true; return; }
                        await page.goto('/cart', { waitUntil: 'domcontentloaded' });
                        await page.waitForTimeout(4000);
                        await cartPage.proceedToCheckout();
                        await checkout.verifyCheckoutLoaded().catch(() => {});
                    }

                    // Enter address
                    console.log(`  → Entering address: "${st.search}"`);
                    await checkout.enterAddress(st.search, st.option);

                    // Navigate to payment step
                    await checkout.continueToShipping();
                    await checkout.fillCompanyName(`Tax Audit - ${st.state}`);
                    await checkout.continueToShippingIfVisible();
                    await checkout.selectLocalPickupIfVisible();
                    await checkout.continueToPayment();

                    // Wait for payment page to fully settle before reading tax
                    await page.waitForTimeout(3000);

                    // Read tax — try clicking the Tax$ row, but don't crash if it fails
                    try {
                        await checkout.verifyTaxDetails();
                    } catch {
                        console.log('  → Tax row click skipped (not visible or not expandable)');
                    }
                    const taxAmount = await checkout.getTaxAmount();
                    console.log(`  → Tax detected: ${taxAmount}`);

                    // Screenshot
                    const shot = `tax_audit_${st.code.toLowerCase()}_${st.city.toLowerCase()}`;
                    await checkout.takeScreenshot(shot);

                    const taxCategory = (!taxAmount || taxAmount === '$0.00' || taxAmount === 'N/A')
                        ? 'No Tax'
                        : 'Tax Applied';

                    results.push({
                        no:           i + 1,
                        state:        st.state,
                        stateCode:    st.code,
                        city:         st.city,
                        addressUsed:  st.option,
                        product:      productName,
                        sku:          SKU,
                        taxAmount,
                        taxCategory,
                        screenshotFile: `screenshots/${shot}.png`,
                        status:       'PASS',
                        errorNote:    '',
                    });

                    console.log(`  ✅  ${st.state} — ${taxAmount} (${taxCategory})`);

                } catch (err: any) {
                    console.error(`  ❌  ERROR for ${st.state}: ${err.message}`);

                    results.push({
                        no:           i + 1,
                        state:        st.state,
                        stateCode:    st.code,
                        city:         st.city,
                        addressUsed:  st.option,
                        product:      productName,
                        sku:          SKU,
                        taxAmount:    'N/A',
                        taxCategory:  'Error',
                        screenshotFile: '',
                        status:       'FAIL',
                        errorNote:    err.message?.substring(0, 150) ?? '',
                    });

                    if (page.isClosed()) { stopLoop = true; return; }

                    const recovered = await page.goto('/cart', { waitUntil: 'domcontentloaded' }).then(() => true).catch(() => false);
                    if (!recovered || page.isClosed()) { stopLoop = true; return; }
                    await page.waitForTimeout(4000);
                    await cartPage.proceedToCheckout().catch(() => {});
                    await checkout.verifyCheckoutLoaded().catch(() => {});
                }
            });
        }

        // ── 5. Generate detailed report ────────────────────────────────────────
        await test.step('Generate Tax_Audit_Report.md', async () => {

            const endTime   = new Date();
            const duration  = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
            const mins      = Math.floor(duration / 60);
            const secs      = duration % 60;

            const passCount  = results.filter(r => r.status === 'PASS').length;
            const failCount  = results.filter(r => r.status === 'FAIL').length;
            const taxStates  = results.filter(r => r.taxCategory === 'Tax Applied');
            const noTaxStates = results.filter(r => r.taxCategory === 'No Tax');

            // ── Table rows ──
            const tableRows = results.map(r => {
                const badge = r.taxCategory === 'Tax Applied'
                    ? '🟠 Tax Applied'
                    : r.taxCategory === 'No Tax'
                    ? '🟢 No Tax'
                    : '🔴 Error';
                const shot  = r.screenshotFile ? `[📷 View](${r.screenshotFile})` : '—';
                return `| ${r.no} | **${r.state}** (${r.stateCode}) | ${r.city} | ${r.addressUsed} | ${r.product} | ${r.sku} | **${r.taxAmount}** | ${badge} | ${r.status} | ${shot} |`;
            }).join('\n');

            // ── Tax Applied list ──
            const taxAppliedList = taxStates.length
                ? taxStates.map(r =>
                    `- **${r.state} (${r.stateCode})** — City: ${r.city} | Tax Charged: **${r.taxAmount}**`)
                  .join('\n')
                : '_No tax was applied in any tested state._';

            // ── No Tax list ──
            const noTaxList = noTaxStates.length
                ? noTaxStates.map(r =>
                    `- **${r.state} (${r.stateCode})** — City: ${r.city} | Tax: **$0.00 / Not Applied**`)
                  .join('\n')
                : '_All tested states had tax applied._';

            // ── Error list ──
            const errorList = failCount > 0
                ? results.filter(r => r.status === 'FAIL').map(r =>
                    `- **${r.state} (${r.stateCode})**: ${r.errorNote}`)
                  .join('\n')
                : '_None — all states completed without automation errors._';

            const now = endTime.toLocaleString();

            const report = `# 🧾 Tax Audit Report — AD Express Checkout
## 5-State USA Tax Verification

---

## 📋 Executive Summary

| Field | Details |
| :--- | :--- |
| **Report Generated** | ${now} |
| **Test Duration** | ${mins} min ${secs} sec |
| **Website** | americandistributorsllc.com |
| **Product Tested** | ${productName} |
| **Product SKU** | ${SKU} |
| **Variants Ordered** | ${VARIANTS.join(' + ')} |
| **Browser** | Chromium (Headless) |
| **Tester** | Automated — Playwright |
| **Total States Audited** | ${results.length} of 5 |
| **States Passed** | ${passCount} |
| **States Failed / Error** | ${failCount} |

---

## 📊 Summary Metrics

| Metric | Count | % of Total |
| :--- | :---: | :---: |
| ✅ States Successfully Tested | ${passCount} | ${((passCount / results.length) * 100).toFixed(0)}% |
| 🟠 States Where Tax Was Applied | ${taxStates.length} | ${((taxStates.length / results.length) * 100).toFixed(0)}% |
| 🟢 States With No Tax | ${noTaxStates.length} | ${((noTaxStates.length / results.length) * 100).toFixed(0)}% |
| 🔴 Automation Errors | ${failCount} | ${((failCount / results.length) * 100).toFixed(0)}% |

---

## 🗺️ States Tested

The following **${results.length} US states** were included in this audit:

| # | State | Code | City |
| :---: | :--- | :---: | :--- |
${STATES.map((s, i) => `| ${i + 1} | ${s.state} | ${s.code} | ${s.city} |`).join('\n')}

---

## 🔍 Detailed Results Per State

| # | State | City | Address Used | Product | SKU | Tax Amount | Tax Status | Test | Screenshot |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
${tableRows}

---

## 🟠 States With Tax Applied

${taxAppliedList}

---

## 🟢 States With No Tax

${noTaxList}

---

## 🔴 Errors / Issues

${errorList}

---

## 📸 Screenshots

All screenshots are saved in the \`screenshots/\` folder of this project:

${results.filter(r => r.screenshotFile).map(r =>
    `- \`${r.screenshotFile}\` — ${r.state} (${r.stateCode})`
).join('\n') || '_No screenshots captured._'}

---

## 📝 Test Methodology

1. **Login** — Authenticated as \`${CREDENTIALS.validUser.username}\` on americandistributorsllc.com
2. **Product Selection** — Navigated to New Arrivals → selected product by SKU \`${SKU}\` → added 2 variants to cart
3. **Checkout Navigation** — Proceeded through Cart → View Cart → Checkout
4. **Address Entry** — For each state, entered a real street address using the Google Places autocomplete
5. **Shipping** — Selected available shipping method (Local Pickup where available)
6. **Tax Capture** — Navigated to Payment step → expanded the Tax row → read and recorded the tax amount
7. **Screenshot** — Captured full-page screenshot of the payment summary for each state

---

## ⚙️ Technical Notes

- Autocomplete uses \`keyboard.type()\` with 80 ms delay per character to trigger Google Places API
- If exact dropdown text does not match, the first suggestion is auto-selected (ArrowDown + Enter)
- Tax amount is parsed from the order summary table on the Payment step
- The test runs in a **single browser session** — cart is loaded once and address is swapped per state

---

*This report was generated automatically by the Playwright automation framework.*
*For questions contact the QA team.*
`;

            const reportPath = 'Tax_Audit_Report.md';
            fs.writeFileSync(reportPath, report, 'utf-8');
            console.log(`\n✅  Report saved → ${path.resolve(reportPath)}`);
            console.log('\n========== FINAL RESULTS ==========');
            results.forEach(r =>
                console.log(`  ${r.stateCode.padEnd(4)} ${r.state.padEnd(16)} Tax: ${r.taxAmount.padEnd(10)} ${r.taxCategory}`)
            );
        });
    });
});
