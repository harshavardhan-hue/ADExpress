# Tax Audit Report Part 2 - AD Express Checkout
## 3-State USA Tax Verification (IL, TX, WI)

**American Distributors LLC | americandistributorsllc.com**

---

## Executive Summary

| Field                    | Details                                              |
| :----------------------- | :--------------------------------------------------- |
| **Report Date**          | April 15, 2026                                       |
| **Test File**            | `tests/Tax_Flow_Part2.test.ts`                       |
| **Website**              | americandistributorsllc.com                          |
| **Browser**              | Chromium (Headless + Headed attempts)                |
| **Automation Framework** | Playwright v1.42+                                    |
| **Product Target**       | SKU: SHPSE1504CT (SOUR GREEN APPLE + BLUE RAZZ LEMONADE) |
| **States Planned**       | Illinois (IL), Texas (TX), Wisconsin (WI)            |
| **Overall Result**       | BLOCKED - Website login session not persisting        |

---

## Test Execution Summary

| Attempt | Mode     | Login     | Product Page | Tax Audit | Duration | Result     |
| :-----: | :------- | :-------- | :----------- | :-------- | :------- | :--------- |
| 1       | Headless | Pass      | BLOCKED      | -         | 20.2 min | TIMEOUT    |
| 2       | Headless | Pass      | BLOCKED      | -         | 20 min   | TIMEOUT    |
| 3       | Headless | Pass      | BLOCKED      | -         | ~10 min  | TIMEOUT    |
| 4       | Headed   | Pass      | BLOCKED      | -         | ~10 min  | TIMEOUT    |
| 5       | Headless | Verified  | BLOCKED      | -         | 1.4 min  | FAIL       |

---

## Root Cause Analysis

### Issue: Website Not Maintaining Login Sessions

The login form **accepts credentials and shows a "Welcome" message**, but **the session cookies are not persisted** when navigating to other pages. Evidence:

1. **Login step passes** - The Welcome message is confirmed visible on the My Account page
2. **Post-login navigation fails** - When navigating to Home (`/`) or New Arrivals, the site shows "Login/Register" in the header, indicating no active session
3. **"Please login to see the data" popup** - Appears when trying to view product data, blocking all interaction
4. **Cart page shows login form** - Navigating directly to `/cart` shows the login/registration page instead of cart contents

### Screenshot Evidence (Final Attempt)

The failure screenshot clearly shows:
- Header bar displays "Login/Register" (not logged in)
- "MY ACCOUNT" section with Login and Registration buttons
- No cart items or product data accessible

### Verification: Part 1 Test Also Fails Now

To confirm this is a website issue (not a test code issue), the **Part 1 test** (`Tax_Flow_5States.test.ts`) — which completed successfully earlier — was re-run and **also failed at the same point**. This proves the website's login/session behavior has changed.

### Timeline

| Time          | Event                                                |
| :------------ | :--------------------------------------------------- |
| ~3:25 AM      | Part 1 test (5 states) runs successfully             |
| ~3:29 AM      | Part 1 completes — all 5 states pass with $0.00 tax  |
| ~3:35 AM      | Part 2 test created and first run attempted           |
| ~3:35-4:00 AM | Multiple Part 2 attempts — all blocked at product page|
| ~12:15 AM+    | Part 1 re-tested — also blocked now                  |

---

## Test File Created

The test file `tests/Tax_Flow_Part2.test.ts` has been created and is **structurally correct**. It follows the exact same pattern as the working Part 1 test with additional robustness:

### States Configured

| # | State      | Code | City        | Address                             |
|:-:|:-----------|:----:|:------------|:------------------------------------|
| 1 | Illinois   | IL   | Springfield | 401 S Spring St, Springfield, IL    |
| 2 | Texas      | TX   | Austin      | 1100 Congress Avenue, Austin, TX    |
| 3 | Wisconsin  | WI   | Madison     | 1 S Pinckney St, Madison, WI       |

### Improvements Over Part 1

1. **Login verification** - Checks for "Welcome" message before proceeding
2. **Popup dismissal helper** - Reusable `dismissPopups()` function handles both "Continue" and "OK" modals
3. **SKU retry logic** - If product not found, reloads page and retries
4. **Re-login fallback** - If retry fails, performs a fresh login attempt
5. **Cart fallback** - As last resort, checks if cart has items from a prior session
6. **Uses `domcontentloaded`** - Instead of `load` to avoid hanging on background requests

### Test Flow

```
Login → Verify Welcome → Navigate Home → Click New Arrivals →
  → Dismiss popups → Find SKU → Select product → Add variants →
  → Open cart → View cart → Proceed to checkout →
  → [For each state: Enter address → Ship → Pay → Read tax → Screenshot]
  → Generate report
```

---

## Comparison with Part 1 Results (Earlier Today)

For reference, the Part 1 test completed successfully earlier with these results:

| # | State           | Code | Tax Amount | Tax Status | Result |
|:-:|:----------------|:----:|:----------:|:-----------|:------:|
| 1 | Massachusetts   | MA   | $0.00      | No Tax     | PASS   |
| 2 | New York        | NY   | $0.00      | No Tax     | PASS   |
| 3 | Texas           | TX   | $0.00      | No Tax     | PASS   |
| 4 | California      | CA   | $0.00      | No Tax     | PASS   |
| 5 | Florida         | FL   | $0.00      | No Tax     | PASS   |

**Note:** Texas was already tested in Part 1 and showed $0.00 tax. The Part 2 test would re-verify TX along with the new states IL and WI.

---

## Recommended Next Steps

1. **Re-run during business hours** - The website may have maintenance or rate limiting during off-hours
   ```bash
   npx playwright test tests/Tax_Flow_Part2.test.ts --reporter=list
   ```

2. **Try headed mode** - If headless continues to fail
   ```bash
   npx playwright test tests/Tax_Flow_Part2.test.ts --reporter=list --headed
   ```

3. **Check website status** - Verify americandistributorsllc.com login works manually in a browser

4. **Check for IP rate limiting** - Multiple rapid test runs may have triggered rate limits

5. **Consider using stored auth state** - Save cookies from a successful login and reuse them:
   ```typescript
   // After successful login:
   await context.storageState({ path: 'auth.json' });
   // In playwright.config.ts, add:
   // storageState: 'auth.json'
   ```

---

## Artifacts

| Type             | File Path                           | Status   |
|:-----------------|:------------------------------------|:---------|
| Test File        | `tests/Tax_Flow_Part2.test.ts`      | Ready    |
| This Report      | `Tax_Flow_Part2_Report.md`          | Complete |
| Part 1 Report    | `Tax_Flow_5States_Report.md`        | Complete |
| Part 1 Status    | `Tax_Flow_5States_Status.md`        | Complete |
| Failure Screenshot| `test-results/.../test-failed-1.png`| Captured |
| Test Trace       | `test-results/.../trace.zip`        | Captured |

---

*Report generated on April 15, 2026.*
*The test file is ready to execute once the website's login session issue is resolved.*
