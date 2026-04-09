import { Locator, Page } from "@playwright/test";

export class LoginPage {
    page: Page;
    usernameInput: Locator;
    passwordInput: Locator;
    loginBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Target the login form specifically to avoid conflicts with Registration or Reset Password fields
        const loginForm = page.locator('div.jsx-2227282855').filter({ hasText: 'Login' }).first(); // Standard container seen in snapshots
        
        this.usernameInput = page.locator('#user_email').first();
        this.passwordInput = page.locator('div').filter({ hasText: /^Password \*/ }).locator('input').first();
        this.loginBtn = page.locator('button').filter({ hasText: /^Login$/ }).first();
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
    }
}
