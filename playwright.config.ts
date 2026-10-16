import { defineConfig, devices } from '@playwright/test';

const incompatibleEnvironmentVariables = [
  'GIO_MODULE_DIR',
  'GIO_EXTRA_MODULES',
  'GIO_LAUNCHED_DESKTOP_FILE',
  'GIO_LAUNCHED_DESKTOP_FILE_PID',
  'GTK_EXE_PREFIX',
  'GTK_IM_MODULE_FILE',
  'GTK_MODULES',
  'GTK_PATH',
  'LD_LIBRARY_PATH',
  'LD_PRELOAD',
];

for (const variable of incompatibleEnvironmentVariables) {
  delete process.env[variable];
}

export default defineConfig({
  testDir: '.',

  testMatch: [
    'setup/auth.setup.ts',
    'tests/**/*.spec.ts',
  ],

  fullyParallel: true,

  workers: 1,

  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
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

      testMatch: /tests\/.*\.spec\.ts/,

      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/account1.json',
      },

      dependencies: ['setup'],
    },

    {
      name: 'firefox',

      testMatch: /tests\/.*\.spec\.ts/,

      use: {
        ...devices['Desktop Firefox'],
        storageState: './auth/account1.json',
      },

      dependencies: ['setup'],
    },

    {
      name: 'webkit',

      testMatch: /tests\/.*\.spec\.ts/,

      use: {
        ...devices['Desktop Safari'],
        storageState: './auth/account1.json',
      },

      dependencies: ['setup'],
    },
  ],
});