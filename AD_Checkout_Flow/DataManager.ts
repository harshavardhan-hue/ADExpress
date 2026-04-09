import { Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { ProductPage } from "./ProductPage";
import { CartPage } from "./CartPage";
import { CheckoutPage } from "./CheckoutPage";
import { HomePage } from "./HomePage";
import { BannerPage } from "../Banner_Test/BannerPage";

export class DataManager {
    page: Page;
    context: BrowserContext;
    private loginPage: LoginPage;
    private productPage: ProductPage;
    private cartPage: CartPage;
    private checkoutPage: CheckoutPage;
    private homePage: HomePage;
    private bannerPage: BannerPage;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        // Initialize Page Objects
        this.loginPage = new LoginPage(this.page);
        this.productPage = new ProductPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
        this.homePage = new HomePage(this.page);
        this.bannerPage = new BannerPage(this.page);
    }

    getLoginPage(): LoginPage {
        return this.loginPage;
    }

    getProductPage(): ProductPage {
        return this.productPage;
    }

    getCartPage(): CartPage {
        return this.cartPage;
    }

    getCheckoutPage(): CheckoutPage {
        return this.checkoutPage;
    }

    getHomePage(): HomePage {
        return this.homePage;
    }

    getBannerPage(): BannerPage {
        return this.bannerPage;
    }
}
