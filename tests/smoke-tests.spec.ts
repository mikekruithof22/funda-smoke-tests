import { expect, test } from "@playwright/test";

import { HomePageHelper } from "../helpers/homePage";
import dotenv from "dotenv";

dotenv.config();
test.use({ userAgent: process.env.USER_AGENT });

test("critical elements home page test", async ({ page }) => {

  const homePageHelper = new HomePageHelper();
  await homePageHelper.loadBaseUrl(page);
  await homePageHelper.acceptAllCookies(page);

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

test("search results for buyers sanity checks", async ({ page }) => {
    
    
    /*
       page.getByTestId("search-box") 

    */
});

test("user login sanity checks", async ({ page }) => {

});

test("makelaar login sanity checks", async ({ page }) => {

});

test("...", async ({ page }) => {

});


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
