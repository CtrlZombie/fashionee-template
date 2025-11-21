import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, // eslint-disable-line no-undef
    timeout: 120000,
  },

  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  }
});

