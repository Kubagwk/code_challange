import { test, expect } from '@playwright/test';

test('User can log in with valid credentials to display products list', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Verify URL contains "inventory"
  await expect(page).toHaveURL(/inventory/);

  // Verify that product container is displayed
  const inventoryContainer = await page.isVisible('.inventory_list');
  expect(inventoryContainer).toBeTruthy();

  // Verify product images are visible
  const productImages = await page.$$('[class="inventory_item_img"] img');
  for (const img of productImages) {
  expect(await img.isVisible()).toBeTruthy();
  }
});

test('Error on login with invalid credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'invalid_user');
  await page.fill('input#password', 'wrong_password');
  await page.click('input#login-button');

  // Verify error message container is visible
  const errorMessageVisible = await page.isVisible('[data-test="error"]');
  expect(errorMessageVisible).toBeTruthy();

  // Verify login form is still visible
  const loginFormVisible = await page.isVisible('input#login-button');
  expect(loginFormVisible).toBeTruthy();
});

test('User can log out successfully', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Perform logout
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.click('#logout_sidebar_link');

  // Verify redirection to login page
  await expect(page).toHaveURL(/index.html/);

  // Verify login form is displayed
  const loginFormVisible = await page.isVisible('input#login-button');
  expect(loginFormVisible).toBeTruthy();
});