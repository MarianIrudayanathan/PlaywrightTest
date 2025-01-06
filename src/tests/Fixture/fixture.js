const {mergeTests} = require('@playwright/test');
const {test: pages} = require('./pageFixture');

export const test = mergeTests(pages);
