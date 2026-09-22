import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  baseURL: 'https://www.automationexercise.com',

  fullyParallel: true,

  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: 'https://www.automationexercise.com',

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    headless: true,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/account1.json',
      },

      dependencies: ['setup'],
    },

    {
      name: 'firefox',

      use: {
        ...devices['Desktop Firefox'],
        storageState: './auth/account1.json',
      },

      dependencies: ['setup'],
    },

    {
      name: 'webkit',

      use: {
        ...devices['Desktop Safari'],
        storageState: './auth/account1.json',
      },

      dependencies: ['setup'],
    },
  ],
});