const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Ajuste para seu backend
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'tests/api/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,

    screenshotOnRunFailure: false,
    video: false,
  },
})
