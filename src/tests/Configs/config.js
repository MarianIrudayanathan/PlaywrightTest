import * as dotenv from 'dotenv';
dotenv.config();

export const testConfig = {
    TestBackOfficeUrl: process.env.TEST_E2E_URL || 'https://manage-case.aat.platform.hmcts.net',
    TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || true,
    TestRetryFeatures: 0, // process.env.RETRY_FEATURES || 2,
    TestRetryScenarios: process.env.RETRY_SCENARIOS || 0,
    TestPathToRun: process.env.E2E_TEST_PATH || './paths/**/*.js',
    TestOutputDir: process.env.E2E_OUTPUT_DIR || './functional-output',
    WaitForTextTimeout: parseInt(process.env.BO_E2E_TEST_TIME_TO_WAIT_FOR_TEXT || 200),
    TestAutoDelayEnabled: process.env.E2E_AUTO_DELAY_ENABLED === 'true',
    TestEnvCwUser: process.env.CW_USER_EMAIL || 'probatecaseworker@gmail.com',
    TestEnvCwPassword: process.env.CW_USER_PASSWORD || 'Monday01',
    TestEnvProfUser: 'probatesolicitortestorgtest5@gmail.com',
    TestEnvProfPassword: 'Pa55wordTest',
    TestForAccessibility: process.env.TESTS_FOR_ACCESSIBILITY === 'true',
    TestForCrossBrowser: process.env.TESTS_FOR_CROSS_BROWSER === 'true',
    ManualDelayShort: 0.25,
    ManualDelayMedium: 0.5,
    ManualDelayLong: 0.75,
    SignOutDelayDefault: process.env.E2E_AUTO_DELAY_ENABLED === 'true' ? 2 : 0,
    SignInDelayDefault: process.env.E2E_AUTO_DELAY_ENABLED === 'true' ? 2 : 0,
    RejectCookies: false,
    RejectCookieDelay: process.env.E2E_AUTO_DELAY_ENABLED === 'true' ? 2 : 0,
    CaseDetailsDelayDefault: process.env.E2E_AUTO_DELAY_ENABLED === 'true' ? 1 : 0,
    MultiUserSignInDelay: process.env.E2E_AUTO_DELAY_ENABLED === 'true' ? 5 : 0,
    GetCaseRefFromUrlDelay: 0, // process.env.E2E_AUTO_DELAY_ENABLED === 'true' ? 4 : 0,
};
