import { Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "../AD_Checkout_Flow/LoginPage";
import { ShopByBrand } from "./ShopByBrand CBD ";

export class DataManager {
    page: Page;
    context: BrowserContext;
    private loginPage: LoginPage;
    private shopByBrandPage: ShopByBrand;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        // Initialize Page Objects for Shop By Brand flow
        this.loginPage = new LoginPage(this.page);
        this.shopByBrandPage = new ShopByBrand(this.page);
    }

    getLoginPage(): LoginPage {
        return this.loginPage;
    }

    getShopByBrandPage(): ShopByBrand {
        return this.shopByBrandPage;
    }
}
