import { Page, expect } from '@playwright/test';

export class CheckoutPage {
    constructor(private page: Page) {}

    // Verify the checkout page (Information step) has loaded
    async verifyCheckoutLoaded() {
        await this.page.waitForLoadState('load');
        // Verify checkout by checking the step progress bar or shipping address section
        await expect(
            this.page.getByText(/SHIPPING ADDRESS/i).first()
        ).toBeVisible({ timeout: 20000 });
    }

    // Enter an address using the react-select address autocomplete
    async enterAddress(searchTerm: string, optionText: string) {
        // Dismiss any Shipping Policy modal that may be blocking the form
        const continueBtn = this.page.getByRole('button', { name: 'Continue' });
        if (await continueBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
            await continueBtn.click();
            await this.page.waitForTimeout(800);
        }

        // Click the address textbox to focus the section
        const addressInput = this.page.getByRole('textbox', { name: 'House number and street name' }).first();
        await addressInput.waitFor({ state: 'visible', timeout: 15000 });
        await addressInput.click();

        // Open the react-select dropdown control
        await this.page.locator('.css-19bb58m').first().click();

        // Use keyboard.type() to trigger the autocomplete suggestions
        await this.page.keyboard.type(searchTerm, { delay: 80 });

        // Wait for the dropdown option and click it
        const option = this.page.getByText(optionText).first();
        await option.waitFor({ state: 'visible', timeout: 20000 });
        await option.click();

        // Press Enter to confirm selection
        await this.page.keyboard.press('Enter');

        // Wait for address selection to trigger recalculations
        await this.page.waitForTimeout(2000);
    }

    async fillCompanyName(name: string) {
        const input = this.page.getByRole('textbox', { name: 'Company Name' });
        await input.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        if (await input.isVisible()) {
            await input.click();
            await input.fill(name);
        }
    }

    async continueToShipping() {
        const btn = this.page.getByText('Continue to shipping').first();
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click();
    }

    // Select Local Pickup shipping option
    async selectLocalPickup() {
        const radio = this.page.locator('#local_pickup');
        await radio.waitFor({ state: 'visible', timeout: 15000 });
        await radio.check();
    }

    async continueToPayment() {
        const btn = this.page.getByText('Continue to payment').first();
        await btn.waitFor({ state: 'visible', timeout: 15000 });
        await btn.click();
    }

    // Expands the Tax row to show the tax amount
    async verifyTaxDetails() {
        const taxRow = this.page.getByText('Tax$');
        await taxRow.waitFor({ state: 'visible', timeout: 15000 });
        await taxRow.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(2000);
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

    // Takes a screenshot and saves it to the screenshots/ folder
    async takeScreenshot(fileName: string) {
        await this.page.waitForTimeout(2000); // stable UI wait
        await this.page.screenshot({ path: `screenshots/${fileName}.png`, fullPage: false });
    }
}
