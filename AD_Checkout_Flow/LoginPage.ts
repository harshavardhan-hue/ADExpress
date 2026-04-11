import { Locator, Page } from "@playwright/test";

export class LoginPage {
    page: Page;
    usernameInput: Locator;
    passwordInput: Locator;
    loginBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Target the login form specifically to avoid conflicts with Registration or Reset Password fields
        this.usernameInput = page.locator('#user_email');
        this.passwordInput = page.locator('input[type="password"]#password');
        this.loginBtn = page.locator('form.loginForm button[type="submit"]').or(page.getByRole('button', { name: /Login/i }).last());
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
    }
}
