import { Page, expect } from "@playwright/test";

import dotenv from "dotenv";

dotenv.config();
export class FundaPageHelper {
    readonly baseUrl: string = 'https://www.funda.nl/';
    readonly fundaDeskUrl: string = 'https://www.fundadesk.nl/start';

    readonly testUserEmail: string |undefined = process.env.CUSTOMER_USER;
    readonly testUserPwd: string |undefined = process.env.CUSTOMER_PWD; 

    readonly realEstateUserName: string = 'randomUser@gmail.com';
    readonly realEstatePwd: string = 'random-pwd-which-does-not-exist';
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;

        this.dotEnvChecks();
    }

    async loadPageAndAcceptCookies(page: Page) {
        await this.loadBaseUrl(page);
        await this.acceptAllCookies(page);
    }

    private async loadBaseUrl(page: Page) {
        await page.goto(this.baseUrl);
    }
    
    private async acceptAllCookies(page: Page) {
        await expect(page.getByTestId("notice")).toBeVisible();
        await page
            .getByRole("button", { name: "Akkoord  en sluiten: Akkoord" })
            .click();
    }  

    private dotEnvChecks(): void {
        if (!this.testUserEmail) {
            throw new Error('No valid customer user configured, check your .env file');
        }

        if (!this.testUserEmail) {
            throw new Error('No valid customer email configured, check your .env file');
        }

        if (!process.env.USER_AGENT) {
            throw new Error('No valid user agent configured, check your .env file');
        }
    }
}