import * as leftNavPanelPage from "../../pages/leftNavPanelPage"

Cypress.Commands.add('clickOnMenu', () => {
  leftNavPanelPage.getMenu_btn()
    .should('be.visible').click()
})

Cypress.Commands.add('changeLocale', address => {
  leftNavPanelPage.getSelectLocale_list()
    .select(address.locale)
    .url()
    .should('include', address.countryCode)
})

Cypress.Commands.add('searchFunction', () => {
  cy.get(':nth-child(2) > .IconButton-sc-1ny8wc9-1').click()
})

Cypress.Commands.add('clearCookiesAndLocalStorage', () => {
  cy.clearCookies({ log: true })
  cy.clearLocalStorage('your item', { log: true })
})
