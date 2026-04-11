import { Locator, Page } from "@playwright/test";

export class ProductPage {
    page: Page;
    incrementQuantityBtn: Locator;
    addToCartBtn: Locator;
    searchInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.incrementQuantityBtn = page.getByText('+', { exact: true }).first();
        this.addToCartBtn = page.getByText(/Add to Cart/i).first();
        this.searchInput = page.getByPlaceholder(/Search for products/i).first();
    }

    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToCategory(categoryPath: string) {
        await this.page.goto(categoryPath);
        await this.page.waitForLoadState('networkidle');
    }

    async setQuantity(amount: number) {
        for (let i = 0; i < amount; i++) {
            await this.incrementQuantityBtn.first().click();
            await this.page.waitForTimeout(200);
        }
    }

    async addToCart() {
        await this.addToCartBtn.first().click();
        await this.page.waitForTimeout(2000); 
    }
}
