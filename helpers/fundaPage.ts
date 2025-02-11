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

    async loadPageAndAcceptCookies(page: Page): Promise<void> {
        await this.loadBaseUrl(page);
        await this.acceptAllCookies(page);
    }

    private async loadBaseUrl(page: Page): Promise<void> {
        await page.goto(this.baseUrl);
    }
    
    private async acceptAllCookies(page: Page): Promise<void> {
        await expect(page.getByTestId("notice")).toBeVisible();
        await page
            .getByRole("button", { name: "Akkoord  en sluiten: Akkoord" })
            .click();
    }  

    private dotEnvChecks(): void {
        const missingEnvVars: string[] = [];
    
        if (!this.testUserEmail) {
            missingEnvVars.push('customer user (testUserEmail)');
        }
    
        if (!this.testUserPwd) {
            missingEnvVars.push('customer email (testUserPwd)');
        }
    
        if (!process.env.USER_AGENT) {
            missingEnvVars.push('user agent (USER_AGENT)');
        }
    
        if (missingEnvVars.length > 0) {
            console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}. Please check your .env file.`);
            return; 
        }
    }
}