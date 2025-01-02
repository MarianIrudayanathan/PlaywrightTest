Playwright Test Automation Project

This repository contains automated tests using Playwright with JavaScript for a Test Project on Login functionality.

Prerequisites:

•	Node.js 14 or higher

•	npm (Node Package Manager)

Installation:
1.	Clone the repository:
git clone https://github.com/MarianIrudayanathan/PlaywrightTest.git

2.	Install dependencies:
yarn install

3.	Install Playwright/test:
yarn create playwright

4.	Install dotenv:
npm install --save dotenv

Running Tests:

Run all tests: 
npx playwright test

Run tests in headed mode: 
npx playwright test login.spec.js --headed

Run tests in a specific browser: 
npx playwright test –project=chromium

Run a specific test file: 
npx playwright test login.spec.js

Run tests in debug mode: 
npx playwright test --debug

Test Reports:

After test execution, HTML report will be generated in: 
playwright-report/index.html

To open the last HTML report: 
npx playwright show-report

Configuration:

The playwright.config.js file contains various settings: 

•	Browsers configuration

•	Retry settings

•	Parallel execution settings

Contributing:

1.	Fork the repository
   
2.	Create your feature branch
   
3.	Commit your changes
   
4.	Push to the branch
   
5.	Create a Pull Request

