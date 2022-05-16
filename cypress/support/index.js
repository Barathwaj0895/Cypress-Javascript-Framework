// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands/utils/utils'
import './commands'
import './commands/checkout'
import './commands/user'
import './commands/products'
import './commands/productDesc'
import './commands/cart'
import './commands/home'
import './commands/navigation'
import './pages/signInPage'
import './pages/leftNavPanelPage'
import './pages/menuItems'
import './pages/productDescPage'
import addContext from "mochawesome/addContext";
import './hooks'
import 'cypress-localstorage-commands'
import './commands/community'
import 'cypress-file-upload'

//TO avoid the accept all cookies banner. That is overlapping few elements.
Cypress.on("window:before:load", window => {
  const COOKIE_NAME = "OptanonAlertBoxClosed"
  const COOKIE_VALUE = new Date()
  window.document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}`
})

//save all failed screenshots in mocha reports.
Cypress.on("test:after:run", (test, runnable) => {

  if (test.state === "failed") {
    const screenshot = `./assets/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`
    addContext({ test }, screenshot)
  }
  else {

    const screenshot = `./assets/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} -- after each hook.png`
    addContext({ test }, screenshot)
  }
});

//Cypress-Grep is used for tagging
require('cypress-grep')()