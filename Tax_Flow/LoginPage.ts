import { Page, expect } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    async login(username: string, password: string) {
        // Use the exact same locators that worked in the main checkout flow
        const usernameInput = this.page.locator('form.loginForm #user_email, #user_email').first();
        const passwordInput = this.page.locator('input[name="password"], #password').filter({ visible: true }).first();
        const loginBtn = this.page.locator('form.loginForm button[type="submit"], button:has-text("Login")').first();

        await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
        await usernameInput.fill(username);
        
        await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        await passwordInput.fill(password);
        
        await loginBtn.click();

        // Wait for potential redirect or loading
        await this.page.waitForLoadState('networkidle');
        
        // Handling the modal which often appears after login
        await this.dismissContinueModal();
    }

    async dismissContinueModal() {
        const dismissBtn = this.page.getByRole('button', { name: 'Continue' });
        // Give it some time to appear, but don't fail if it doesn't
        await dismissBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        if (await dismissBtn.isVisible()) {
            await dismissBtn.click();
            await expect(dismissBtn).not.toBeVisible({ timeout: 10000 });
        }
    }
}
