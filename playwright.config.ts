import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./automations",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["list"], ["html", { open: "always", port: 0 }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    launchOptions: {
      args: ["--disable-http2"],
    },

    trace: "on-first-retry",
    video: "retain-on-failure",

    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  /* Configure projects for major browsers */
  projects: [
    // 🌐 Desktop
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: [
        "automations/**/weekly-price-checker.spec.ts",
        "automations/**/weekly-woolworths-price-checker.spec.ts",
        "automations/**/one-product-woolworths-price-checker.spec.ts"
      ],
      workers: 1,
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: [
        "automations/**/weekly-price-checker.spec.ts",
        "automations/**/weekly-woolworths-price-checker.spec.ts",
        "automations/**/one-product-woolworths-price-checker.spec.ts"
      ],
    },

    // 🔗 API (API specs only)
    /* - Api Tests are not expected to be run against any device */

    //{
    //name: 'webkit',
    //use: { ...devices['Desktop Safari'] },
    // },

    //📱 Test against mobile viewports.
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
