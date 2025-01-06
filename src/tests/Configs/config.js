import * as dotenv from 'dotenv';
dotenv.config();

export const testConfig = {
    TestBackOfficeUrl: process.env.TEST_E2E_URL || 'https://manage-case.aat.platform.hmcts.net',
    WaitForTextTimeout: parseInt(process.env.BO_E2E_TEST_TIME_TO_WAIT_FOR_TEXT || 200),
    TestAutoDelayEnabled: process.env.E2E_AUTO_DELAY_ENABLED === 'true',
    TestEnvCwUser: 'probatecaseworker@gmail.com',
    TestEnvCwPassword: 'Monday01',
    TestEnvProfUser: 'probatesolicitortestorgtest5@gmail.com',
    TestEnvProfPassword: 'Pa55wordTest',
    ManualDelayShort: 0.25,
    ManualDelayMedium: 0.5,
    ManualDelayLong: 0.75,
    SignOutDelayDefault: 2,
    SignInDelayDefault: process.env.E2E_AUTO_DELAY_ENABLED === 'true' ? 2 : 0,
    RejectCookies: false,
    RejectCookieDelay: 2,
    CaseDetailsDelayDefault: 2,
    GetCaseRefFromUrlDelay: 2
};
