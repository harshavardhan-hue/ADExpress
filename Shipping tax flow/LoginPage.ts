import { Page, expect } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    async login(username: string, password: string) {
        // Stable ID-based locators (most reliable across page reloads)
        await this.page.locator('#user_email').fill(username);
        await this.page.locator('form.loginForm input[name="password"]').fill(password);
        await this.page.locator('form.loginForm button[type="submit"]').click();

        // Wait for redirect away from the login page
        await this.page.waitForURL((url: URL) => !url.toString().includes('tab=login'), { timeout: 45000 });
        await this.page.waitForLoadState('load');

        // Verify login actually succeeded by checking for username in the header
        await expect(
            this.page.getByText(/UtkarshShukla/i).first()
        ).toBeVisible({ timeout: 20000 });
    }

    async dismissContinueModal() {
        const dismissBtn = this.page.getByRole('button', { name: 'Continue' });
        await dismissBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        if (await dismissBtn.isVisible()) {
            await dismissBtn.click();
            await expect(dismissBtn).not.toBeVisible({ timeout: 10000 });
        }
    }
}
