import { expect, test } from "@playwright/test";

import { HomePageHelper } from "../helpers/homePage";
import dotenv from "dotenv";

dotenv.config();
test.use({ userAgent: process.env.USER_AGENT });

test("critical elements home page test", async ({ page }) => {
  const homePageHelper = new HomePageHelper();
  await homePageHelper.loadPageAndAcceptCookies(page);

  // Three most crucial HTML elements
  await expect(
    page.locator("header").filter({ hasText: "Menu MenuKopen Zoek een" })
  ).toBeVisible();
  await expect(
    page.locator("nav").filter({ hasText: "Menu MenuKopen Zoek een" })
  ).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();

  // Nav elements
  await expect(page.getByRole("button", { name: "Inloggen" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Mijn Huis", exact: true })
  ).toBeVisible();

  // Body elements
  await expect(page.getByTestId("search-box")).toBeVisible();
  await expect(page.getByRole("button", { name: "Koop" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Huur" })).toBeVisible();

  // Footer elements
  await expect(page.getByRole("link", { name: "English" })).toBeVisible();
});


test.describe('search', () => {
  test("search results appear", async ({ page }) => {
    const homePageHelper = new HomePageHelper();
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
    // Check for first three search results the container and listing details visibility
    for (let i = 0; i < 4; i++) {
      const searchResultContainer = searchResultContainers.nth(i);
      await expect(searchResultContainer).toBeVisible();
      const listingDetailsAddress = page.getByTestId("listingDetailsAddress").nth(i);
      await expect(listingDetailsAddress).toBeVisible();
    }
  });
  
  
  test("basic filtering check", async ({ page }) => {
new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: tmp code, remove when done.
    const homePageHelper = new HomePageHelper();
    await homePageHelper.loadPageAndAcceptCookies(page);
  
    await page.getByTestId("search-box").click();
    await page.getByTestId("search-box").fill("Amsterdam");
    await page
      .getByRole("option", { name: "Amsterdam Plaats in Noord-" })
      .click();
  
    const beforeFilterText = await page.getByTestId('pageHeader').getByText('koopwoningen').innerText();

    const houseAmountBeforeFiltering = parseInt(beforeFilterText.replace(/\D/g, ''), 10);
    await expect(page.getByRole("button", { name: "Filters" })).toBeVisible();
  
    // Open filter and filter on 'woonhuis'
    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByTestId("checkbox-house").click();
    // await expect(page.getByText("FiltersSluitenKoopHuurPrijs")).toBeVisible();
  
    // await page.getByRole("checkbox", { name: "Woonhuis" }).check();
    // expect(page.getByRole("checkbox", { name: "Woonhuis" })).toBeChecked();
new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: tmp code, remove when done.

    // Three sanity checks after filtering: I. Filter appears left top II. url gets query params  
    // III. amount of houses is lower after filtering
    await expect(page).toHaveURL(`${homePageHelper.baseUrl}?object_type=["house"]`);
    const woonhuisFilter = page.getByTestId("SelectedFilterobject_type");
    await expect(woonhuisFilter).toBeVisible();


    const afterFilterText = await page.getByTestId('pageHeader').getByText('koopwoningen').innerText();
    const houseAmountAfterFiltering = parseInt(afterFilterText.replace(/\D/g, ''), 10);

    // Assert that the numeric value has decreased
    expect(houseAmountAfterFiltering).toBeLessThan(houseAmountBeforeFiltering);
  });

});



// test("user login sanity checks", async ({ page }) => {
  // await page.getByRole('button', { name: 'Inloggen' }).click();
  // await page.getByRole('textbox', { name: 'E-mailadres' }).click();
  // await page.getByRole('textbox', { name: 'E-mailadres' }).fill('mikekruithof22@hotmail.com');
  // await page.getByRole('textbox', { name: 'Wachtwoord' }).click();
  // await page.getByRole('textbox', { name: 'Wachtwoord' }).fill('6Usedaforce!');
  // await page.getByRole('button', { name: 'Log in' }).click();
  
// });

// test("makelaar login sanity checks", async ({ page }) => {

// goto https://login.fundadesk.nl/
// await page2.getByRole('link', { name: 'Inloggen voor makelaars' }).click();
// await page2.getByRole('textbox', { name: 'Gebruikersnaam' }).click();
// await page2.getByRole('textbox', { name: 'Gebruikersnaam' }).fill('blabla');
// await page2.getByRole('textbox', { name: 'Gebruikersnaam' }).press('Tab');
// await page2.getByRole('textbox', { name: 'Wachtwoord' }).fill('blabwachtwoord');
// await page2.getByRole('button', { name: 'Log in' }).click();
// });

/*
Target: const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Meld je nu aan' }).first().click();
  const page1 = await page1Promise;
await page2.goto('https://www.fundadesk.nl/start');
We want to have 5 automated smoke tests which would help us releasing the website 
with confidence. 
[...]

We will review: 
• Quality of the code  
• Quality of the tests 
• During our interview we look at your motivation for specific choices 


*/
