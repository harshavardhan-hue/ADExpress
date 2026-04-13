import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testMatch: ['**/tests/**/*.test.ts', '**/Banner_Test/**/*.test.ts'],
    /* Maximum time one test can run for. */
    timeout: 120000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toBeVisible();`
         */
        timeout: 10000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Run one test at a time — avoids resource contention on login/cart state */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['line'],
        ['allure-playwright'],
        ['list'],
        ['html'],
        ['json', { outputFile: 'results.json' }],
        ['junit', { outputFile: 'results.xml' }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        baseURL: 'https://americandistributorsllc.com',
        trace: 'on',
        screenshot: 'on',
        video: 'on',
        headless: true,
        ignoreHTTPSErrors: true,
        permissions: ['geolocation'],
        viewport: { width: 3020, height: 2080 },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: null,
                deviceScaleFactor: undefined,
                launchOptions: {
                    args: ['--start-maximized']
                }
            },
        },
    ],
});
