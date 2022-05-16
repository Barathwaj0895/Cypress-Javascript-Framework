import * as leftNavPanelPage from '../../pages/leftNavPanelPage'
import * as menuItemsPage from '../../pages/menuItems'

Cypress.Commands.add('openMenu', () => {
    cy.log('Click on menu')
    leftNavPanelPage.getMenu_btn()
        .should('be.visible')
        .click()
})

Cypress.Commands.add('selectCategory', (category) => {
    cy.log(`select category : ${category}`)
    leftNavPanelPage.getSelectItemCategory_link(category)
        .should('be.visible')
        .first()
        .click()
})

Cypress.Commands.add('selectLocale', (locale) => {
    let code
    switch (locale) {
        case 'United States': code = 'en-US'
            break;
        case 'Canada (EN)': code = 'en-CA'
            break;
        case 'Canada (FR)': code = 'fr-CA'
            break;
        case 'United Kingdom': code = 'en-GB'
            break;
        case 'Ireland': code = 'en-IE'
            break;
        case 'Sweden': code = 'en-SE'
            break;
        case 'Denmark': code = 'en-DK'
            break;
        case 'France': code = 'fr-FR'
            break;
    }
    cy.log(`Select locale : ${locale}`)
    leftNavPanelPage.getSelectLocale_list()
        .select(locale, { force: true })
    cy.url().should('include', code)
})

//select item from top navigation menu
Cypress.Commands.add('selectMenuCategory', (category) => {
    cy.log(`select category : ${category}`)
    if (menuItemsPage.getSelectMenuItemCategory_link(category).contains(category)) {
        menuItemsPage.getSelectMenuItemCategory_link(category).contains(category)
            .click({ force: true })
    } else {
        menuItemsPage.getItemNavList().scrollTo('center').getSelectMenuItemCategory_link(category)
            .contains(category).click({ force: true })
    }
})