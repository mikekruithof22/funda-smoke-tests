import { Page, expect } from "@playwright/test";

export class HomePageHelper {
    baseUrl: string = 'https://www.funda.nl/';

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
}