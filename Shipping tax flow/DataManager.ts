import { Page, BrowserContext } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { ProductPage } from './ProductPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';

export class DataManager {
    private loginPage: LoginPage;
    private homePage: HomePage;
    private productPage: ProductPage;
    private cartPage: CartPage;
    private checkoutPage: CheckoutPage;

    constructor(private page: Page, private context: BrowserContext) {
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
        this.productPage = new ProductPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
    }

    getLoginPage(): LoginPage { return this.loginPage; }
    getHomePage(): HomePage { return this.homePage; }
    getProductPage(): ProductPage { return this.productPage; }
    getCartPage(): CartPage { return this.cartPage; }
    getCheckoutPage(): CheckoutPage { return this.checkoutPage; }
}
