const {expect} = require('@playwright/test');
const launchPageConfig = require('../DataFile/launchConfig.json');

exports.MainPage = class MainPage {
    constructor(page) {
        this.page = page;
        this.linkLocator = page.getByRole('link', { name: launchPageConfig.launchLink });
        this.installLinkLocator = page.getByRole('heading', { name: launchPageConfig.installLink });
    }

    async proceedWithView() {
        await this.linkLocator.click();

        // Expects page to have a heading with the name of Installation.
        await expect(this.installLinkLocator).toBeVisible();
    }
};
