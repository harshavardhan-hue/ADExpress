# 🧾 Tax Audit Report — AD Express Checkout
## 5-State USA Tax Verification

---

## 📋 Executive Summary

| Field | Details |
| :--- | :--- |
| **Report Generated** | 4/14/2026, 3:29:21 AM |
| **Test Duration** | 4 min 38 sec |
| **Website** | americandistributorsllc.com |
| **Product Tested** | Need Help |
| **Product SKU** | SKU: SHPSE1504CT |
| **Variants Ordered** | SOUR GREEN APPLE + BLUE RAZZ LEMONADE |
| **Browser** | Chromium (Headless) |
| **Tester** | Automated — Playwright |
| **Total States Audited** | 5 of 5 |
| **States Passed** | 5 |
| **States Failed / Error** | 0 |

---

## 📊 Summary Metrics

| Metric | Count | % of Total |
| :--- | :---: | :---: |
| ✅ States Successfully Tested | 5 | 100% |
| 🟠 States Where Tax Was Applied | 0 | 0% |
| 🟢 States With No Tax | 5 | 100% |
| 🔴 Automation Errors | 0 | 0% |

---

## 🗺️ States Tested

The following **5 US states** were included in this audit:

| # | State | Code | City |
| :---: | :--- | :---: | :--- |
| 1 | Massachusetts | MA | Boston |
| 2 | New York | NY | Albany |
| 3 | Texas | TX | Austin |
| 4 | California | CA | Sacramento |
| 5 | Florida | FL | Tallahassee |

---

## 🔍 Detailed Results Per State

| # | State | City | Address Used | Product | SKU | Tax Amount | Tax Status | Test | Screenshot |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| 1 | **Massachusetts** (MA) | Boston | Nashua Street, Boston, MA, USA | Need Help | SKU: SHPSE1504CT | **$0.00** | 🟢 No Tax | PASS | [📷 View](screenshots/tax_audit_ma_boston.png) |
| 2 | **New York** (NY) | Albany | State Street, Albany, NY, USA | Need Help | SKU: SHPSE1504CT | **$0.00** | 🟢 No Tax | PASS | [📷 View](screenshots/tax_audit_ny_albany.png) |
| 3 | **Texas** (TX) | Austin | 1100 Congress Avenue, Austin, TX, USA | Need Help | SKU: SHPSE1504CT | **$0.00** | 🟢 No Tax | PASS | [📷 View](screenshots/tax_audit_tx_austin.png) |
| 4 | **California** (CA) | Sacramento | 1315 10th Street, Sacramento, CA, USA | Need Help | SKU: SHPSE1504CT | **$0.00** | 🟢 No Tax | PASS | [📷 View](screenshots/tax_audit_ca_sacramento.png) |
| 5 | **Florida** (FL) | Tallahassee | 400 S Monroe Street, Tallahassee, FL, USA | Need Help | SKU: SHPSE1504CT | **$0.00** | 🟢 No Tax | PASS | [📷 View](screenshots/tax_audit_fl_tallahassee.png) |

---

## 🟠 States With Tax Applied

_No tax was applied in any tested state._

---

## 🟢 States With No Tax

- **Massachusetts (MA)** — City: Boston | Tax: **$0.00 / Not Applied**
- **New York (NY)** — City: Albany | Tax: **$0.00 / Not Applied**
- **Texas (TX)** — City: Austin | Tax: **$0.00 / Not Applied**
- **California (CA)** — City: Sacramento | Tax: **$0.00 / Not Applied**
- **Florida (FL)** — City: Tallahassee | Tax: **$0.00 / Not Applied**

---

## 🔴 Errors / Issues

_None — all states completed without automation errors._

---

## 📸 Screenshots

All screenshots are saved in the `screenshots/` folder of this project:

- `screenshots/tax_audit_ma_boston.png` — Massachusetts (MA)
- `screenshots/tax_audit_ny_albany.png` — New York (NY)
- `screenshots/tax_audit_tx_austin.png` — Texas (TX)
- `screenshots/tax_audit_ca_sacramento.png` — California (CA)
- `screenshots/tax_audit_fl_tallahassee.png` — Florida (FL)

---

## 📝 Test Methodology

1. **Login** — Authenticated as `UtkarshShukla` on americandistributorsllc.com
2. **Product Selection** — Navigated to New Arrivals → selected product by SKU `SKU: SHPSE1504CT` → added 2 variants to cart
3. **Checkout Navigation** — Proceeded through Cart → View Cart → Checkout
4. **Address Entry** — For each state, entered a real street address using the Google Places autocomplete
5. **Shipping** — Selected available shipping method (Local Pickup where available)
6. **Tax Capture** — Navigated to Payment step → expanded the Tax row → read and recorded the tax amount
7. **Screenshot** — Captured full-page screenshot of the payment summary for each state

---

## ⚙️ Technical Notes

- Autocomplete uses `keyboard.type()` with 80 ms delay per character to trigger Google Places API
- If exact dropdown text does not match, the first suggestion is auto-selected (ArrowDown + Enter)
- Tax amount is parsed from the order summary table on the Payment step
- The test runs in a **single browser session** — cart is loaded once and address is swapped per state

---

*This report was generated automatically by the Playwright automation framework.*
*For questions contact the QA team.*
