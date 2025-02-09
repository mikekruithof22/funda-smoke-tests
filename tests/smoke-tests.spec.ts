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

test("search results for buyers appear", async ({ page }) => {
    const homePageHelper = new HomePageHelper();
    await homePageHelper.loadPageAndAcceptCookies(page);

    await page.getByTestId('search-box').click();
    await page.getByTestId('search-box').fill('Amsterdam');

    new Promise(resolve => setTimeout(resolve, 2000)); // TODO: tmp code, remove when doe. 
    await page.getByRole('option', { name: 'Amsterdam Plaats in Noord-' }).click();

    // check if search query is inside the search container and some filters
    await expect(page.getByTestId('searchBoxSuggestions-mobile').getByText('Amsterdam')).toBeVisible();


    await page.waitForSelector('div.border-b.pb-3');

    const searchResultContainers = page.locator('div.border-b.pb-3');
    const count = await searchResultContainers.count();

    // Only check the first three search results for image and check for data-testid="listingDetailsAddress"
    for (let i = 0; i < 4; i++) {
        const searchResultContainer = searchResultContainers.nth(i);
        await expect(searchResultContainer).toBeVisible();
        const listingDetailsAddress = searchResultContainer.locator('[data-testid="listingDetailsAddress"]');
        await expect(listingDetailsAddress).toBeVisible();
    }
});

// TODO: third test is work in progress
test("check search results amount after filtering once", async ({ page }) => {
    const homePageHelper = new HomePageHelper();
    await homePageHelper.loadPageAndAcceptCookies(page);

    await page.getByTestId('search-box').click();
    await page.getByTestId('search-box').fill('Amsterdam');
    await page.getByRole('option', { name: 'Amsterdam Plaats in Noord-' }).click();

    const amountOfHousesCount = page.locator('div.truncate.font-semibold');

    // await expect(page.getByRole('button', { name: 'Bewaar zoekopdracht' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Filters' })).toBeVisible();


    // filter op 'Woonhuis' and check the url and filter "woonhuis" filter is visible()
    await page.getByRole('button', { name: 'Filters' }).click();
    await expect(page.getByText('FiltersSluitenKoopHuurPrijs')).toBeVisible();

    await page.getByRole('checkbox', { name: 'Woonhuis' }).check();
    expect(page.getByRole('checkbox', { name: 'Woonhuis' })).toBeChecked();

    await expect(page).toHaveURL(`${homePageHelper}?object_type=["house"]`);
    const woonhuisFilter = page.locator('li[data-testid="SelectedFilterobject_type"]');
    await expect(woonhuisFilter).toBeVisible();



});

// test("home search results filter checks", async ({ page }) => {

// });


// test("user login sanity checks", async ({ page }) => {

// });

// test("makelaar login sanity checks", async ({ page }) => {

// });

// test("...", async ({ page }) => {

// });


/*
Target: 
We want to have 5 automated smoke tests which would help us releasing the website 
with confidence. 
[...]

We will review: 
• Quality of the code  
• Quality of the tests 
• During our interview we look at your motivation for specific choices 


*/
