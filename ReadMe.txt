ReadMe file describe the deatils of the code challenge task

Files:

1. TestStrategy.txt file is available in the Documents folder
2. ManualTestCases.txt file is available in the Documents folder
3. Automated tests cases are avilable in the tests folder
a) LoginLogout.spec.ts with test cases:
User can log in with valid credentials to display products list
Error on login with invalid credentials
User can log out successfully
b) CartAndProduct.spec.ts
Product details are displeyed after selection
User can add an item to the cart and display it properly
User can remove an item from the cart
c) Checkout.spec.ts
Checkout information page is properly displayed
Error on checkout information page with incomplete dat
Checkout overview page is properly displayed with two items
User can complete the checkout process

Test Framework:

Requirements to use test environment:
1. Node.js
2. Playwright
3. Browsers

To display the runs go to Actions tab an you will se all the worklow runs. 
Tests are automaticly launched every commit. The are also prepared to run every 24 hours (Example of the run executen at midnight: Playwright Tests #8: Scheduled). They can be launched manually by runing the single job.
Report generated during the execution playwright-html-report is available in the Artifacts section at the bottom in the details of the sepeare run.

Test environment configuration:

Test are set to be launched only on chromium, to add firefox and webkit change file playwright.config.ts 
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
	
	
	

