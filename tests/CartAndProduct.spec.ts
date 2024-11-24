import { test, expect } from '@playwright/test';

test('Product details are displeyed after selection', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Verify that product items are displayed
  const productItems = await page.$$('[class="inventory_item"]');
  expect(productItems.length).toBeGreaterThan(0);

  // Select a product to view its details
  const productLink = page.locator('#item_4_img_link').getByRole('img');
  await productLink.click();

  // Assert that the product description is displayed
  const productDescription = await page.locator('.inventory_details_desc').textContent();
  expect(productDescription).toBeTruthy(); // Check product description exists

  // Assert that the product price is displayed
  const productPrice = await page.locator('.inventory_details_price').textContent();
  expect(productPrice).toBeTruthy(); // Ensure price is visible and correct

  // Assert that the "Add to Cart" button is displayed
  const addToCartButton = await page.getByRole('button', { name: 'ADD TO CART' }).isEnabled();
  expect(addToCartButton).toBe(true); // Confirm the button is clickable
});

test('User can add an item to the cart and display it properly', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Wait for the product list to load
  await page.waitForSelector('.inventory_list');

  // Add a product to the cart
  const addToCartButton = 'button[data-test="add-to-cart-sauce-labs-backpack"]';
  await page.locator('div').filter({ hasText: /^\$29\.99ADD TO CART$/ }).getByRole('button').click();

  // Verify cart badge
  await page.waitForSelector('.shopping_cart_badge');
  const cartBadge = await page.textContent('.shopping_cart_badge');
  expect(cartBadge).toBe('1');

  // Navigate to the cart
  await page.click('.shopping_cart_link');

  // Wait for the cart page to load and verify the added product
  const cartItemSelector = '.cart_item';
  await page.waitForSelector(cartItemSelector);

  const cartItemText = await page.textContent(cartItemSelector);
  expect(cartItemText).toContain('Sauce Labs Backpack');
});

test('User can remove an item from the cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/index.html');
  await page.fill('input#user-name', 'standard_user');
  await page.fill('input#password', 'secret_sauce');
  await page.click('input#login-button');

  // Add a product to the cart
  const addToCartButton = 'button[data-test="add-to-cart-sauce-labs-backpack"]';
  await page.locator('div').filter({ hasText: /^\$29\.99ADD TO CART$/ }).getByRole('button').click();

  // Navigate to the cart
  await page.click('.shopping_cart_link');

  // Wait for the cart page to load and verify the added product
  const cartItemSelector = '.cart_item';
  await page.waitForSelector(cartItemSelector);

  // Remove the product from the cart
  const removeButton = 'button[data-test="remove-sauce-labs-backpack"]';
  await page.getByRole('button', { name: 'REMOVE' }).click();

  // Verify that the cart is now empty
  const cartItems = await page.$$('.cart_item');
  expect(cartItems.length).toBe(0);

  const emptyCartBadge = await page.$('.shopping_cart_badge');
  expect(emptyCartBadge).toBeNull();
});