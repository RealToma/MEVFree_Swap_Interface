import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'yp82ef',
  videoUploadOnPasses: false,
  defaultCommandTimeout: 10000,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      return {
        ...config,
        // Only enable Chrome.
        // Electron (the default) has issues injecting window.ethereum before pageload, so it is not viable.
        browsers: config.browsers.filter(({ name }) => name === 'chrome'),
      }
    },
    baseUrl: 'https://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
