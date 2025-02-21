import { expect, test } from "@playwright/test";

import { FundaPageHelper } from "../helpers/fundaPage";
import dotenv from "dotenv";

dotenv.config();
test.use({ userAgent: process.env.USER_AGENT });

test("most critical HTML elements test", async ({ page }) => {
  const homePageHelper = new FundaPageHelper(page);
  await homePageHelper.loadPageAndAcceptCookies(page);

  // Header elements
  await expect(page.locator("header").nth(1)).toBeVisible();
  await expect(page.locator("header").filter({ hasText: "Menu MenuKopen Zoek een" })).toBeVisible();

  // Nav elements
  await expect(page.locator("nav").filter({ hasText: "Menu MenuKopen Zoek een" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inloggen" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mijn Huis", exact: true })).toBeVisible();

  // Body elements
  await expect(page.getByTestId("search-box")).toBeVisible();
  await expect(page.getByRole("button", { name: "Koop" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Huur" })).toBeVisible();

  // Footer elements
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toBeVisible();
});


test.describe('search tests', () => {
  
  test("search results appear", async ({ page }) => {
    const homePageHelper = new FundaPageHelper(page);
    await homePageHelper.loadPageAndAcceptCookies(page);
  
    await page.getByTestId("search-box").click();
    await page.getByTestId("search-box").fill("Amsterdam");
    await page
      .getByRole("option", { name: "Amsterdam Plaats in Noord-" })
      .click();
  
    await expect(
      page.getByTestId("searchBoxSuggestions-mobile").getByText("Amsterdam")
    ).toBeVisible();
  
    await page.waitForSelector("div.border-b.pb-3");
  
    const searchResultContainers = page.locator("div.border-b.pb-3");  
    // Verify that the container and listing details are present for the first three search results.
    for (let i = 0; i < 4; i++) {
      const searchResultContainer = searchResultContainers.nth(i);
      await expect(searchResultContainer).toBeVisible();
      const listingDetailsAddress = page.getByTestId("listingDetailsAddress").nth(i);
      await expect(listingDetailsAddress).toBeVisible();
    }
  });
  
  test("open a search result", async ({ page }) => {
    const homePageHelper = new FundaPageHelper(page);
    await homePageHelper.loadPageAndAcceptCookies(page);
  
    await page.getByTestId("search-box").click();
    await page.getByTestId("search-box").fill("Amsterdam");
    await page
      .getByRole("option", { name: "Amsterdam Plaats in Noord-" })
      .click();
  
    await expect(
      page.getByTestId("searchBoxSuggestions-mobile").getByText("Amsterdam")
    ).toBeVisible();
    
    const searchResultContainers = page.locator("div.border-b.pb-3");  
    const searchResultContainer = searchResultContainers.nth(2);
    await expect(searchResultContainer).toBeVisible();

    await page.getByTestId("listingDetailsAddress").nth(2).click();

    await expect(page).toHaveURL(/.*detail/);
    await expect(page.getByRole('heading', { name: 'Omschrijving' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Vraag bezichtiging aan' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kenmerken' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Plattegrond' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Amsterdam', exact: true })).toBeVisible();
  });

});

test("user can login and logout", async ({ page }) => {
  const homePageHelper = new FundaPageHelper(page);
  await homePageHelper.loadPageAndAcceptCookies(page);
  // login
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page).toHaveURL(/.*account/);

  await page.getByRole('textbox', { name: 'E-mailadres' }).click();
  await page.getByRole('textbox', { name: 'E-mailadres' }).fill(homePageHelper.testUserEmail as string);
  await page.getByRole('textbox', { name: 'Wachtwoord' }).click();
  await page.getByRole('textbox', { name: 'Wachtwoord' }).fill(homePageHelper.testUserPwd as string);
  await page.getByRole('button', { name: 'Log in' }).click();
 
  await page.locator('#headlessui-menu-button-v-0-34').click();
  await expect(page.getByText('Mijn account', { exact: true }).nth(1)).toBeVisible();
  await expect(page.getByText('Uitloggen', { exact: true }).nth(1)).toBeVisible();

  // log out
  await page.getByText('Uitloggen', { exact: true }).nth(1).click();
  await expect(page).toHaveURL(`${homePageHelper.baseUrl}`); 
  await expect(page.getByRole('button', { name: 'Inloggen' })).toBeVisible();
  
});

test("real estate agent can login and logout", async ({ page }) => {
  const homePageHelper = new FundaPageHelper(page);
  await page.goto(homePageHelper.fundaDeskUrl);

  await page.getByRole('link', { name: 'Inloggen voor makelaars' }).click();
  await expect(page).toHaveURL(/.*account/);

  await page.getByRole('textbox', { name: 'Gebruikersnaam' }).click();
  await page.getByRole('textbox', { name: 'Gebruikersnaam' }).fill(homePageHelper.realEstateUserName);
  await page.getByRole('textbox', { name: 'Wachtwoord' }).click();
  await page.getByRole('textbox', { name: 'Wachtwoord' }).fill(homePageHelper.realEstatePwd);
  await page.getByRole('button', { name: 'Log in' }).click();

  // Unable to proceed with this test case without real estate agent credentials.
  // If such credentials were available, additional validations on the next screen 
  // (specific to logged-in real estate users) would be performed.

});