import { test, expect } from '@playwright/test';

test('Checkout information page is properly displayed', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Navigate to the checkout information page
  await page.click('.shopping_cart_link');
  await page.getByRole('link', { name: 'CHECKOUT' }).click();

  // Assert that the "First Name" field is visible
  const firstNameFieldVisible = await page.isVisible('input[data-test="firstName"]');
  expect(firstNameFieldVisible).toBeTruthy();

  // Assert that the "Last Name" field is visible
  const lastNameFieldVisible = await page.isVisible('input[data-test="lastName"]');
  expect(lastNameFieldVisible).toBeTruthy();

  // Assert that the "Postal Code" field is visible
  const postalCodeFieldVisible = await page.isVisible('input[data-test="postalCode"]');
  expect(postalCodeFieldVisible).toBeTruthy();
});

test('Error on checkout information page with incomplete data', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Navigate to the checkout information page
  await page.click('.shopping_cart_link');
  await page.getByRole('link', { name: 'CHECKOUT' }).click();

  // Wait for the "First Name" input field, which should be present on the "Checkout: Your Information" page
  await page.waitForSelector('input[data-test="firstName"]');

  // Fill out first name and last name fields
  await page.fill('input[data-test="firstName"]', 'Peter');
  await page.fill('input[data-test="lastName"]', 'Parker');

  // Click continue to proceed
  const continueButton = 'input[data-test="continue"]';
  await page.getByRole('button', { name: 'CONTINUE' }).click();

  // Verify the error message displayed due to missing postal code
  const errorMessageSelector = 'h3:has-text("Error: Postal Code is required")';
  await page.waitForSelector(errorMessageSelector);
  const errorMessage = await page.textContent(errorMessageSelector);
  expect(errorMessage).toBe('Error: Postal Code is required');
});

test('Checkout overview page is properly displayed with two items', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Add two products
  await page.locator('div').filter({ hasText: /^\$29\.99ADD TO CART$/ }).getByRole('button').click();
  await page.locator('div').filter({ hasText: /^\$9\.99ADD TO CART$/ }).getByRole('button').click();

  // Navigate to the checkout overview page
  await page.click('.shopping_cart_link');
  await page.getByRole('link', { name: 'CHECKOUT' }).click();
  await page.fill('input[data-test="firstName"]', 'Peter');
  await page.fill('input[data-test="lastName"]', 'Parker');
  await page.fill('input[data-test="postalCode"]', '1962');
  await page.getByRole('button', { name: 'CONTINUE' }).click();

  // Verify summary items and total
  const summaryItems = await page.isVisible('.cart_item');
  expect(summaryItems).toBeTruthy();

  // Assert that "Payment Information" section is visible
  const paymentInfoSection = await page.isVisible('text=Payment Information');
  expect(paymentInfoSection).toBeTruthy();

  // Assert that "Shipping Information" section is visible
  const shippingInfoSection = await page.isVisible('text=Shipping Information');
  expect(shippingInfoSection).toBeTruthy();

  // Assert Item Total
  const itemTotal = await page.textContent('.summary_subtotal_label'); // Label showing the total price of items
  expect(itemTotal).toContain('$39.98'); // Assuming the total price for two items

  // Assert Tax
  const taxAmount = await page.textContent('.summary_tax_label'); // Tax label
  expect(taxAmount).toContain('$3.20'); // Assuming tax is calculated correctly (based on the platform's pricing)

  // Assert Total
  const totalAmount = await page.textContent('.summary_total_label'); // Total amount after tax
  expect(totalAmount).toContain('$43.18'); // Total (Item Total + Tax)
});

test('User can complete the checkout process', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Navigate to the checkout finish page
  await page.click('.shopping_cart_link');
  await page.getByRole('link', { name: 'CHECKOUT' }).click();
  await page.fill('input[data-test="firstName"]', 'Peter');
  await page.fill('input[data-test="lastName"]', 'Parker');
  await page.fill('input[data-test="postalCode"]', '1962');
  await page.getByRole('button', { name: 'CONTINUE' }).click();
  await page.getByRole('link', { name: 'FINISH' }).click();

  // Check if the image in the checkout complete container is displayed
  const imageLocator = page.locator('#checkout_complete_container img');
  await expect(imageLocator).toBeVisible(); // Ensure the image is visible

  // Check that the "Finish" button is no longer displayed
  const finishButton = page.locator('button[data-test="finish"]');
  await expect(finishButton).toBeHidden(); // Ensure the "Finish" button is no longer visible
});