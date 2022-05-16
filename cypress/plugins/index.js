/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const fs = require('fs-extra');
const path = require('path');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'chrome') {
      // launch chrome using incognito
      launchOptions.args.push(`${config.env.incognito}`)
      return launchOptions
    }
  })
  on('after:spec', (spec, results) => {
    fs.appendFileSync("./results_to_email_body", `\n${spec.relative}|${results.stats.tests}|${results.stats.passes}|${results.stats.failures}|${results.stats.pending}|${results.stats.skipped}|${parseInt(results.stats.wallClockDuration)/60*1000}`, 'utf8');
  })

  on('before:run', () => {
    fs.writeFileSync('./results_to_email_body', '','utf8' )
    fs.appendFileSync("./results_to_email_body", "Spec\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t|Tests|Passing|Failing|Pending|Skipped|Duration", "utf8");
  })

  require('cypress-grep/src/plugin')(config)

  const env = config.env.configFile || 'development';

  const pathToEnvFile = path.resolve(
    '../',
    `CypressAutomation/cypress/configFiles/${env}`,
    '.env'
  );

  const result = require('dotenv').config({ path: pathToEnvFile, debug: process.env.DEBUG })
  if (result.error) {
    throw result.error
  }

  const pathToConfigFile = path.resolve(
    '../',
    `CypressAutomation/cypress/configFiles/${env}`,
    `${env}.json`
  );

  envConfigFile = fs.readJsonSync(pathToConfigFile)

  Object.entries(envConfigFile).forEach((entry) => {
    const [key, value] = entry;
    config[key] = value
  });

  config.env.stripeBearerToken = process.env.stripeBearerToken
  config.env.cognitoUserPoolWebClientID = process.env.cognitoUserPoolWebClientID
  config.env.challengebypass = process.env.challengebypass
  config.env.test_mode = process.env.test_mode
  if (env === "production") {
    config.env.PRODUCTION_BASE_URL = process.env.PRODUCTION_BASE_URL
    config.env.PRODUCTION_CART_SERVICE_BASE_URL = process.env.PRODUCTION_CART_SERVICE_BASE_URL
    config.env.AUTHORIZATION_TOKEN = process.env.AUTHORIZATION_TOKEN
    config.env.WAF_CHECK = process.env.WAF_CHECK
    config.env.EDITOR_PIN = process.env.EDITOR_PIN
    config.env.US_STRIPE_TEST_API_KEY = process.env.US_STRIPE_TEST_API_KEY
  }

  return config;
}