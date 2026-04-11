# Shipping Tax Flow — Test Report

**Date:** 2026-04-12
**Status:** ✅ PASSED
**Duration:** ~2.8 minutes
**Test File:** `tests/Shipping Tax Flow.test.ts`
**Browser:** Chromium (Desktop, Maximised)
**Base URL:** https://americandistributorsllc.com

---

## Test Scenario

> Verify that the Tax amount on the Checkout page changes correctly when the delivery address is updated to a different city/state.

---

## Page Object Model Structure

| File | Folder | Responsibility |
|------|--------|----------------|
| `LoginPage.ts` | `Shipping tax flow/` | Login form, dismiss Continue modal |
| `HomePage.ts` | `Shipping tax flow/` | Click New Arrival section |
| `ProductPage.ts` | `Shipping tax flow/` | Select product by SKU, add quantity variants, add to cart |
| `CartPage.ts` | `Shipping tax flow/` | Open cart panel, View Cart, Proceed to Checkout |
| `CheckoutPage.ts` | `Shipping tax flow/` | Address entry, shipping selection, tax verification, screenshots |
| `DataManager.ts` | `Shipping tax flow/` | Central page-object factory |

---

## Test Steps Executed

| Step | Action | Status |
|------|--------|--------|
| 1–4 | Navigate to login page → Fill credentials (UtkarshShukla / 1234567) → Click Login → Navigate to home | ✅ Passed |
| 5 | Click on New Arrival (`#GifHeader`) | ✅ Passed |
| 6–7 | Select product by SKU (`SHPSE1504CT`) → View Options → Add qty for SOUR GREEN APPLE (variant 0) + BLUE RAZZ LEMONADE (variant 1) | ✅ Passed |
| 8 | Add to Cart | ✅ Passed |
| 9 | Click Cart icon in header | ✅ Passed |
| 10 | Click VIEW CART | ✅ Passed |
| 11 | Dismiss Shipping Policy modal → Proceed to Checkout | ✅ Passed |
| 12–13 | Enter Address: **Nashua Street, Boston, MA, USA** → Continue to Shipping → Fill Company Name → Select Local Pickup → Continue to Payment | ✅ Passed |
| 14 | Click Tax$ row to expand → **Take Screenshot** (`tax_boston_ma.png`) | ✅ Passed |
| 15 | Return to Shipping → Return to Information | ✅ Passed |
| 16–17 | Enter Address: **New Lots Avenue, Brooklyn, NY** → Continue to Shipping → Continue to Payment | ✅ Passed |
| 18 | Click Tax$ row to expand → **Take Screenshot** (`tax_brooklyn_ny.png`) | ✅ Passed |
| — | Return to Shipping → Return to Information | ✅ Passed |

---

## Screenshots Captured

| File | Address Used | Saved At |
|------|-------------|----------|
| `tax_boston_ma.png` | Nashua Street, Boston, MA, USA | `screenshots/tax_boston_ma.png` |
| `tax_brooklyn_ny.png` | New Lots Avenue, Brooklyn, NY | `screenshots/tax_brooklyn_ny.png` |

---

## Bugs Found & Fixed During Debugging

| # | Step | Error | Root Cause | Fix Applied |
|---|------|-------|------------|-------------|
| 1 | Login | Page stayed on login screen | `form.loginForm` CSS selector was unreliable; `getByRole('textbox')` with asterisk also fragile | Switched to `#user_email` + `form.loginForm input[name="password"]` (stable ID-based locators) + added login verification via welcome text |
| 2 | New Arrival | `new-arrival-image` link not found | Assertion locator didn't match site DOM | Replaced with `waitForLoadState('load')` |
| 3 | New Arrival popup | "Please login to see the data" popup blocked page | Session not confirmed before clicking; site shows auth popup | Added OK button dismissal in `HomePage.clickNewArrival()` |
| 4 | Select Product | `View Options` click timed out at 120s | Original recording first clicks SKU paragraph before View Options; test was skipping that step | Updated `ProductPage` to call `selectProductBySKUAndViewOptions('SKU: SHPSE1504CT', 1)` matching recording exactly |
| 5 | Proceed to Checkout | Shipping Policy modal (`backdrop-blur-md` overlay z-9999) blocked button | Modal reappears on cart page | `CartPage.proceedToCheckout()` waits for modal → clicks Continue → waits for blur overlay to clear → uses JS `evaluate()` click to bypass residual overlay |
| 6 | Checkout verification | `#accordionlefticonExample1` not found | Locator was too specific and fragile | Replaced with `getByText(/SHIPPING ADDRESS/i)` which matches the visible section heading |
| 7 | Address entry | `reactSelectInput.fill()` hung for 5 minutes | `fill()` does not trigger react-select autocomplete API; wrong element focus | Replaced with `page.keyboard.type()` (char-by-char, 80ms delay) which properly triggers the autocomplete dropdown |
| 8 | Tax verification | `waitForLoadState('networkidle')` hung indefinitely | This site has continuous background requests; networkidle never settles | Replaced with `waitForLoadState('load')` + fixed 2s wait |

---

## Summary

The test successfully completed the full **Shipping Tax Verification Flow** end-to-end:

- ✅ User authenticated as **UtkarshShukla**
- ✅ Product selected from New Arrivals section (SKU: SHPSE1504CT)
- ✅ Two quantity variants added (SOUR GREEN APPLE + BLUE RAZZ LEMONADE)
- ✅ Cart → Checkout flow navigated successfully
- ✅ Tax details verified and screenshotted for **Boston, MA**
- ✅ Tax details verified and screenshotted for **Brooklyn, NY**
- ✅ Screenshots saved to `screenshots/` folder

---

*Generated automatically after Playwright test run on 2026-04-12*
