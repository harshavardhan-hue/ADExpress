import { Page, expect } from '@playwright/test';

export class CheckoutPage {
    constructor(private page: Page) {}

    // Verify the checkout page (Information step) has loaded
    async verifyCheckoutLoaded() {
        await this.page.waitForTimeout(3000);
        // Verify checkout by checking the step progress bar or shipping address section
        await expect(
            this.page.getByText(/SHIPPING ADDRESS/i).first()
        ).toBeVisible({ timeout: 20000 });
    }

    // Enter an address using the react-select address autocomplete.
    // Tries to click the exact optionText suggestion first; if not visible within 6s,
    // falls back to ArrowDown + Enter to select the first available suggestion.
    async enterAddress(searchTerm: string, optionText: string) {
        console.log(`    [DEBUG] Starting enterAddress for: ${searchTerm}`);
        // Dismiss any Shipping Policy modal that may be blocking the form
        const continueBtn = this.page.getByRole('button', { name: 'Continue' });
        if (await continueBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
            console.log('    [DEBUG] Dismissing continue modal');
            await continueBtn.click();
            await this.page.waitForTimeout(800);
        }

        // Click the address textbox to focus the section.
        // We use a more specific locator to avoid matching Billing address or Line 2 fields.
        console.log('    [DEBUG] Waiting for address input...');
        const addressInput = this.page.locator('#react-select-2-input, input[placeholder*="House number"]').first();
        await addressInput.waitFor({ state: 'visible', timeout: 15000 });
        console.log('    [DEBUG] Clicking address input');
        await addressInput.click({ force: true });

        // Open the react-select dropdown control if not open
        console.log('    [DEBUG] Checking for react-select wrapper');
        const wrapper = this.page.locator('.css-19bb58m, .css-13cymwt-control').first();
        if (await wrapper.isVisible({ timeout: 2000 })) {
            console.log('    [DEBUG] Clicking wrapper to ensure focus');
            await wrapper.click().catch(() => {});
        }

        // Use keyboard.type() to trigger the autocomplete suggestions
        console.log(`    [DEBUG] Typing search term: ${searchTerm}`);
        await this.page.keyboard.type(searchTerm, { delay: 100 });

        // Wait for autocomplete API to respond
        console.log('    [DEBUG] Waiting for suggestions...');
        await this.page.waitForTimeout(3000);

        // Try clicking the exact dropdown option.
        try {
            console.log(`    [DEBUG] Looking for option: ${optionText}`);
            const option = this.page.getByText(optionText).first();
            await option.click({ timeout: 5000 });
            console.log('    [DEBUG] Option clicked');
        } catch {
            console.log('    [DEBUG] Exact option not found, falling back to ArrowDown+Enter');
            // Exact option not visible — auto-select the first available suggestion
            await this.page.keyboard.press('ArrowDown');
            await this.page.waitForTimeout(500);
            await this.page.keyboard.press('Enter');
            console.log('    [DEBUG] Fallback selection complete');
        }

        // Wait for address selection to trigger recalculations
        await this.page.waitForTimeout(2000);
        console.log('    [DEBUG] enterAddress complete');
    }

    // Like enterAddress but auto-selects the first suggestion using ArrowDown + Enter.
    // Returns whatever text ends up in the address input after selection.
    async enterAddressAutoSelect(searchTerm: string): Promise<string> {
        // Dismiss any blocking modal
        const continueBtn = this.page.getByRole('button', { name: 'Continue' });
        if (await continueBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
            await continueBtn.click();
            await this.page.waitForTimeout(800);
        }

        // Focus the address input using a more specific selector
        const addressInput = this.page.locator('#shipping-address-selector, #react-select-2-input, input[placeholder*="House number"]').first();
        await addressInput.waitFor({ state: 'visible', timeout: 15000 });
        await addressInput.click();

        // Open react-select control (clicks the hidden input to trigger autocomplete API)
        const wrapper = this.page.locator('.css-19bb58m, .css-13cymwt-control').first();
        if (await wrapper.isVisible({ timeout: 2000 })) {
            await wrapper.click();
        }

        // Type to trigger Google Places suggestions (char-by-char, 100ms delay)
        await this.page.keyboard.type(searchTerm, { delay: 100 });

        // Wait for the autocomplete dropdown to populate
        await this.page.waitForTimeout(2500);

        // Navigate to and select the first suggestion
        await this.page.keyboard.press('ArrowDown');
        await this.page.waitForTimeout(400);
        await this.page.keyboard.press('Enter');

        // Allow address data to populate and recalculations to run
        await this.page.waitForTimeout(2000);

        // Read back the selected address text from the input
        const selected = await addressInput.inputValue().catch(() => '');
        return selected.trim() || searchTerm.trim();
    }

    // Reads the tax dollar amount from the order summary on the payment page.
    // Call this after verifyTaxDetails() has expanded the tax row.
    async getTaxAmount(): Promise<string> {
        console.log('    [DEBUG] Getting tax amount');
        try {
            await this.page.waitForTimeout(2000);

            // Approach 1: find the element containing "Tax" and look for the amount next to it
            // We search for "Tax" followed by a dollar amount in the same or nearby text.
            const bodyText = await this.page.locator('body').innerText();
            
            // Look for "Tax" (case insensitive) followed by optional spaces/$ and then the amount.
            // This avoids matching "Subtotal" or "Total" which are different labels.
            const taxRegex = /Tax\s*[:\-]?\s*\$\s*([\d,]+\.[\d]{2})/i;
            const match = bodyText.match(taxRegex);
            
            if (match) {
                console.log(`    [DEBUG] Tax regex match: ${match[0]}`);
                return `$${match[1]}`;
            }

            // Approach 2: More specific row-based search
            const taxRow = this.page.locator('tr, div, p').filter({ hasText: /^Tax$/i }).first();
            const parent = this.page.locator('div, tr').filter({ has: taxRow }).first();
            const rowText = await parent.innerText().catch(() => '');
            console.log(`    [DEBUG] Tax row innerText: ${rowText}`);
            
            if (rowText) {
                // In row text, we look for the first amount AFTER the word Tax
                const taxIdx = rowText.search(/Tax/i);
                const afterTax = rowText.substring(taxIdx);
                const matchAfter = afterTax.match(/\$([\d,]+\.[\d]{2})/);
                if (matchAfter) return matchAfter[0];
            }

            return '$0.00';
        } catch (err: any) {
            console.log(`    [DEBUG] getTaxAmount error: ${err.message}`);
            return 'N/A';
        }
    }

    async fillCompanyName(name: string) {
        console.log(`    [DEBUG] Filling company name: ${name}`);
        const input = this.page.getByRole('textbox', { name: 'Company Name' });
        await input.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        if (await input.isVisible()) {
            await input.click();
            await input.fill(name);
        }
    }

    async continueToShipping() {
        console.log('    [DEBUG] Clicking Continue to shipping');
        const btn = this.page.getByText('Continue to shipping').first();
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click();
        console.log('    [DEBUG] Clicked Continue to shipping');
    }

    // Soft version — only clicks if the button is currently visible (used in state loop)
    async continueToShippingIfVisible(): Promise<boolean> {
        console.log('    [DEBUG] Checking if Continue to shipping is visible');
        const btn = this.page.getByText('Continue to shipping').first();
        if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await btn.click();
            await this.page.waitForTimeout(1000);
            console.log('    [DEBUG] Clicked Continue to shipping (Soft)');
            return true;
        }
        return false;
    }

    // Select Local Pickup shipping option
    async selectLocalPickup() {
        const radio = this.page.locator('#local_pickup');
        await radio.waitFor({ state: 'visible', timeout: 15000 });
        await radio.check();
    }

    // Soft version — selects local pickup only if the radio button is visible
    async selectLocalPickupIfVisible(): Promise<void> {
        console.log('    [DEBUG] Checking for local pickup option');
        const radio = this.page.locator('#local_pickup');
        if (await radio.isVisible({ timeout: 5000 }).catch(() => false)) {
            await radio.check();
            console.log('    [DEBUG] Selected local pickup');
        }
    }

    async continueToPayment() {
        console.log('    [DEBUG] Clicking Continue to payment');
        const btn = this.page.getByText('Continue to payment').first();
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click();
        console.log('    [DEBUG] Clicked Continue to payment');
    }

    // Expands the Tax row to show the tax amount.
    // Uses fixed wait instead of waitForLoadState — the site has continuous background
    // requests that cause waitForLoadState('load') to trigger unexpected navigations.
    async verifyTaxDetails() {
        console.log('    [DEBUG] Verifying tax details');
        const taxRow = this.page.getByText(/^Tax$/i).first();
        if (await taxRow.isVisible({ timeout: 15000 })) {
            console.log('    [DEBUG] Tax row found, clicking');
            await taxRow.click().catch(() => {});
            await this.page.waitForTimeout(3000); // allow accordion/AJAX to settle
        } else {
            console.log('    [DEBUG] Tax row not found by strict label, trying partial');
            const partialTax = this.page.getByText('Tax', { exact: false }).first();
            await partialTax.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
            await partialTax.click().catch(() => {});
        }
    }

    async returnToShipping() {
        const link = this.page.getByText('<< Return to Shipping');
        await link.waitFor({ state: 'visible', timeout: 10000 });
        await link.click();
    }

    async returnToInformation() {
        const link = this.page.getByText('<< Return to information', { exact: true });
        await link.waitFor({ state: 'visible', timeout: 10000 });
        await link.click();
    }

    // Takes a screenshot and saves it to the screenshots/ folder.
    // Errors are swallowed — a failed screenshot must not abort the state loop.
    async takeScreenshot(fileName: string) {
        try {
            await this.page.waitForTimeout(1000);
            await this.page.screenshot({ path: `screenshots/${fileName}.png`, fullPage: false });
        } catch {
            // page may have navigated; skip screenshot silently
        }
    }
}
