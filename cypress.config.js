import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {},
        baseUrl: "http://localhost:8000",
        supportFile: "cypress/support/e2e.js",
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    },
});
