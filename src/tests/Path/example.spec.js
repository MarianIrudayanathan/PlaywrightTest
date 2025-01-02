// @ts-check
const { test} = require('../Fixture/fixture');
// const launchPageConfig = require('../DataFile/launchConfig.json');

test('Application Login', async ({ basePage, signInPage }) => {
  await basePage.logInfo('Login as Caseworker');
  await signInPage.authenticateWithIdamIfAvailable(false);
});

test('Main Page', async ({ basePage, signInPage, makeAxeBuilder, page }, testInfo) => {
  await basePage.logInfo( 'Verify user login');
  await signInPage.authenticateWithIdamIfAvailable(false);
  await signInPage.verifyLogin();

 /*  const accessibilityScanResults = await makeAxeBuilder()
      // Automatically uses the shared AxeBuilder configuration,
      // but supports additional test-specific configuration too
      .analyze();

  const violations = accessibilityScanResults.violations;
  if (violations.length !==0) {
      console.log(`${page.url()}`);
  }
*/
  // await signInPage.signOut();
});
