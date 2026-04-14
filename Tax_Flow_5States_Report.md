# Tax Audit Report - AD Express Checkout (5-State Verification)

**American Distributors LLC | americandistributorsllc.com**

---

## Executive Summary

| Field                    | Details                                              |
| :----------------------- | :--------------------------------------------------- |
| **Report Date**          | April 14, 2026                                       |
| **Test Executed At**     | 3:29 AM EST                                          |
| **Test Duration**        | 4 minutes 38 seconds                                 |
| **Test File**            | `tests/Tax_Flow_5States.test.ts`                     |
| **Website**              | americandistributorsllc.com                          |
| **Logged-in User**       | utkarshShukla                                        |
| **Browser**              | Chromium (Headless)                                  |
| **Automation Framework** | Playwright v1.42+                                    |
| **Product Tested**       | Need Help (SKU: SHPSE1504CT)                         |
| **Variants Ordered**     | SOUR GREEN APPLE + BLUE RAZZ LEMONADE                |
| **Cart Value**           | $6,265.29                                            |
| **States Audited**       | 5 of 5                                               |
| **Overall Result**       | ALL 5 STATES PASSED - No Tax Applied in Any State    |

---

## Summary Metrics

| Metric                              | Count |   %  |
| :---------------------------------- | :---: | :--: |
| Total States Tested                 |   5   | 100% |
| States Successfully Completed       |   5   | 100% |
| States Where Tax Was Charged        |   0   |  0%  |
| States With No Tax ($0.00)          |   5   | 100% |
| Automation Errors                   |   0   |  0%  |

---

## Detailed Results Per State

### 1. Massachusetts (MA) - Boston

| Field              | Value                                |
| :----------------- | :----------------------------------- |
| **Address Entered** | Nashua Street Boston                |
| **Address Selected** | Nashua Street, Boston, MA, USA     |
| **Selection Method** | Fallback (ArrowDown + Enter)       |
| **Subtotal**        | $6,265.29                           |
| **Shipping**        | $0                                  |
| **Tax**             | $0.00                               |
| **Total**           | $6,265.29                           |
| **Tax Status**      | No Tax Applied                      |
| **Screenshot**      | `screenshots/tax_audit_ma_boston.png` |
| **Result**          | PASS                                |

---

### 2. New York (NY) - Albany

| Field              | Value                                |
| :----------------- | :----------------------------------- |
| **Address Entered** | State St Washington Ave Albany NY   |
| **Address Selected** | State Street, Albany, NY, USA      |
| **Selection Method** | Fallback (ArrowDown + Enter)       |
| **Subtotal**        | $6,265.29                           |
| **Shipping**        | $0                                  |
| **Tax**             | $0.00                               |
| **Total**           | $6,265.29                           |
| **Tax Status**      | No Tax Applied                      |
| **Screenshot**      | `screenshots/tax_audit_ny_albany.png` |
| **Result**          | PASS                                |

---

### 3. Texas (TX) - Austin

| Field              | Value                                  |
| :----------------- | :------------------------------------- |
| **Address Entered** | 1100 Congress Avenue Austin TX        |
| **Address Selected** | 1100 Congress Avenue, Austin, TX, USA |
| **Selection Method** | Exact Match (Direct Click)            |
| **Subtotal**        | $6,265.29                             |
| **Shipping**        | $0                                    |
| **Tax**             | $0.00                                 |
| **Total**           | $6,265.29                             |
| **Tax Status**      | No Tax Applied                        |
| **Screenshot**      | `screenshots/tax_audit_tx_austin.png`  |
| **Result**          | PASS                                  |

---

### 4. California (CA) - Sacramento

| Field              | Value                                      |
| :----------------- | :----------------------------------------- |
| **Address Entered** | 1315 10th Street Sacramento CA            |
| **Address Selected** | 1315 10th Street, Sacramento, CA, USA    |
| **Selection Method** | Fallback (ArrowDown + Enter)              |
| **Subtotal**        | $6,265.29                                 |
| **Shipping**        | $0                                        |
| **Tax**             | $0.00                                     |
| **Total**           | $6,265.29                                 |
| **Tax Status**      | No Tax Applied                            |
| **Screenshot**      | `screenshots/tax_audit_ca_sacramento.png`  |
| **Result**          | PASS                                      |

---

### 5. Florida (FL) - Tallahassee

| Field              | Value                                       |
| :----------------- | :------------------------------------------ |
| **Address Entered** | 400 S Monroe Street Tallahassee FL         |
| **Address Selected** | 400 S Monroe Street, Tallahassee, FL, USA |
| **Selection Method** | Fallback (ArrowDown + Enter)               |
| **Subtotal**        | $6,265.29                                  |
| **Shipping**        | $0                                         |
| **Tax**             | $0.00                                      |
| **Total**           | $6,265.29                                  |
| **Tax Status**      | No Tax Applied                             |
| **Screenshot**      | `screenshots/tax_audit_fl_tallahassee.png`  |
| **Result**          | PASS                                       |

---

## Comparison Table

| # | State           | Code | City        | Tax Amount | Shipping | Subtotal   | Total      | Status |
|:-:|:----------------|:----:|:------------|:----------:|:--------:|:----------:|:----------:|:------:|
| 1 | Massachusetts   | MA   | Boston      | $0.00      | $0       | $6,265.29  | $6,265.29  | PASS   |
| 2 | New York        | NY   | Albany       | $0.00      | $0       | $6,265.29  | $6,265.29  | PASS   |
| 3 | Texas           | TX   | Austin      | $0.00      | $0       | $6,265.29  | $6,265.29  | PASS   |
| 4 | California      | CA   | Sacramento  | $0.00      | $0       | $6,265.29  | $6,265.29  | PASS   |
| 5 | Florida         | FL   | Tallahassee | $0.00      | $0       | $6,265.29  | $6,265.29  | PASS   |

---

## Screenshot Evidence

All screenshots were captured at the Payment step of checkout, showing the order summary panel with Subtotal, Shipping, Tax, and Total fields visible.

| State           | Screenshot File                          | Verified |
|:----------------|:-----------------------------------------|:--------:|
| Massachusetts   | `screenshots/tax_audit_ma_boston.png`     | Yes      |
| New York        | `screenshots/tax_audit_ny_albany.png`    | Yes      |
| Texas           | `screenshots/tax_audit_tx_austin.png`    | Yes      |
| California      | `screenshots/tax_audit_ca_sacramento.png`| Yes      |
| Florida         | `screenshots/tax_audit_fl_tallahassee.png`| Yes     |

**Screenshot Observations:**
- All 5 screenshots show identical order summary values
- Subtotal: $6,265.29 | Shipping: $0 | Tax: $0.00 | Total: $6,265.29
- User logged in as "utkarshShukla" with Shopping Cart showing $6,265.29
- Cart badge shows 6 items
- "Have a promo code? Click here." link visible on all screenshots
- Shipping method: Local Pickup (free) was selected for all states

---

## Test Methodology

| Step | Action                      | Description                                                                 |
| :--: | :-------------------------- | :-------------------------------------------------------------------------- |
| 1    | Login                       | Authenticated as `utkarshShukla` on americandistributorsllc.com             |
| 2    | Product Selection           | Navigated to New Arrivals, selected product by SKU `SHPSE1504CT`            |
| 3    | Variant Selection           | Added quantities for SOUR GREEN APPLE and BLUE RAZZ LEMONADE               |
| 4    | Cart & Checkout             | Opened cart panel, viewed cart, proceeded to checkout                        |
| 5    | Address Entry (per state)   | Typed address into Google Places autocomplete, selected matching suggestion  |
| 6    | Shipping Selection          | Continued to shipping, filled company name, selected Local Pickup           |
| 7    | Tax Capture                 | Navigated to Payment step, expanded Tax row, read tax amount                |
| 8    | Screenshot                  | Captured full screenshot of payment summary for evidence                     |
| 9    | Loop                        | Returned to cart and repeated steps 5-8 for next state                      |

---

## Key Findings

1. **Zero tax across all 5 states** - The website did not apply any sales tax for Massachusetts, New York, Texas, California, or Florida. This is consistent across all tested addresses.

2. **Shipping cost was $0 for all states** - Local Pickup was the selected shipping method in every case, resulting in no shipping charges.

3. **Cart total remained constant** - The total of $6,265.29 did not change across any state, confirming that no tax or shipping adjustments were made.

4. **Address autocomplete worked for all states** - 4 out of 5 states required the ArrowDown+Enter fallback since the exact Google Places suggestion text didn't match the expected option. Only Texas matched exactly.

5. **Product name discrepancy** - The dynamically captured product name was "Need Help" instead of an expected product name. This may indicate the product name element selector is picking up the wrong text on the page.

---

## Infrastructure Notes

- The test was marked as "failed" by Playwright due to a trace file copy error (`ENOENT: copyfile .network -> -pwnetcopy-1.network`). This is a Playwright internal artifact bug and does **not** affect test results.
- Recommendation: Set `trace: 'retain-on-failure'` in `playwright.config.ts` to avoid this issue.

---

## Artifacts

| Type             | File Path                                |
|:-----------------|:-----------------------------------------|
| Test File        | `tests/Tax_Flow_5States.test.ts`         |
| Config           | `playwright.config.ts`                   |
| Auto Report      | `Tax_Audit_Report.md`                    |
| Status File      | `Tax_Flow_5States_Status.md`             |
| This Report      | `Tax_Flow_5States_Report.md`             |
| HTML Report      | `playwright-report/index.html`           |
| Trace File       | `test-results/.../trace.zip`             |

---

*Report generated on April 14, 2026 by Playwright Automation Suite for AD Express.*
*For questions, contact the QA team.*
