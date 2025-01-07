const {expect} = require('@playwright/test');
const {testConfig} = require ('../Configs/config');
const {BasePage} = require('../Pages/basePage');
const {captureExpectResult} = require('../utils/assertionUtils');
const launchPageConfig = require('../DataFile/launchConfig.json');

exports.SignInPage = class SignInPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.usernameLocator = this.page.getByText('Email address', {exact: true});
        this.passwordLocator = this.page.getByText('Password', {exact: true});
        this.caseListPageLocator = this.page.getByRole('link', {name: 'Case list'});
        this.submitButtonLocator = page.getByRole('button', {name: 'Sign in'});
    }

    async launchPage () {
        await this.page.goto(`${testConfig.TestBackOfficeUrl}/`);
        await this.page.waitForTimeout(testConfig.ManualDelayLong);
        await expect(this.page.getByRole('heading', {name: 'Sign in', exact: true})).toBeVisible();
    }

    async enterUserCredentials (useProfessionalUser, signInDelay = testConfig.SignInDelayDefault) {
        await expect(this.usernameLocator).toBeVisible();
        await expect(this.passwordLocator).toBeVisible();
        await this.page.locator('#username').fill(useProfessionalUser ? testConfig.TestEnvProfUser : testConfig.TestEnvCwUser);
        await this.page.locator('#password').fill(useProfessionalUser ? testConfig.TestEnvProfPassword : testConfig.TestEnvCwPassword);
        await expect(this.submitButtonLocator).toBeEnabled();
        await this.submitButtonLocator.click();

        // await expect(this.usernameLocator).not.toBeVisible();
        await this.rejectCookies();
        await this.page.waitForTimeout(signInDelay);
    }

    async verifyLogin() {
        const result = await captureExpectResult(
            expect(this.usernameLocator).toBeVisible()
        );

        if (!result.passed) {
            console.log('Login Successful');
            await expect(this.caseListPageLocator).toBeVisible();

            // Accessibility check after login
            const accessibilityResults = await this.performAccessibilityScan();
            if (!accessibilityResults.passed) {
                // Handle violations as needed
                console.log('Login page accessibility issues:', accessibilityResults.violations);
            }
            await this.signOut();
        } else {
            console.log('Login failed');
        }

    }

    async signOut(delay = testConfig.SignOutDelayDefault) {
        await this.waitForSignOutNavigationToComplete('nav.hmcts-header__navigation ul li:last-child a', delay);
        await expect(this.usernameLocator).toBeVisible();
    }
};
