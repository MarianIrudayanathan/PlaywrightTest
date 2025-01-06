const {expect} = require('@playwright/test');
const {testConfig} = require ('../Configs/config');
const AxeBuilder = require('@axe-core/playwright').default;

exports.BasePage = class BasePage {
    constructor(page) {
        this.page = page;
        this.rejectLocator = page.getByRole('button', {name: 'Reject analytics cookies'});
    }

    async logInfo(scenarioName, log, caseRef) {
        let ret = scenarioName;
        await this.page.waitForTimeout(testConfig.GetCaseRefFromUrlDelay);
        if (log) {
            ret = ret + ' : ' + log;
        }
        if (caseRef) {
            ret = ret + ' : ' + caseRef;
        }
        console.info(ret);
    }

    async rejectCookies () {
        if (testConfig.RejectCookies) {
            try {
                //const rejectLocator = {css: 'button.govuk-button[value="reject"]'};
                const numVisibleCookieBannerEls = await this.rejectLocator.count();
                if (numVisibleCookieBannerEls > 0) {
                    // just reject additional cookies
                    await expect(this.rejectLocator).toBeEnabled();
                    await this.rejectLocator.click();
                    await this.page.waitForTimeout(testConfig.RejectCookieDelay);
                }
            } catch (e) {
                console.error(`error trying to close cookie banner: ${e.message}`);
            }
        }
    }

    async performAccessibilityScan() {
        try {
            const makeAxeBuilder = () => new AxeBuilder({ page: this.page })
                .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])
                .exclude('#commonly-reused-element-with-known-issue');
            const accessibilityScanResults = await makeAxeBuilder().analyze();

            const violations = accessibilityScanResults.violations;
            if (violations.length !== 0) {
                console.log(`Accessibility violations found at: ${this.page.url()}`);
                console.log('Violations:', JSON.stringify(violations, null, 2));
                return { passed: false, violations };
            }
            return { passed: true, violations: [] };
        } catch (error) {
            console.error('Error during accessibility scan:', error);
            return { passed: false, violations: [], error };
        }
    }

    async waitForSignOutNavigationToComplete(signOutLocator) {
        const navigationPromise = this.page.waitForNavigation();
        await expect(this.page.locator(`${signOutLocator}`)).toBeVisible();
        await expect(this.page.locator(`${signOutLocator}`)).toBeEnabled();
        this.page.locator(`${signOutLocator}`).click();
        await navigationPromise;
    }

};
