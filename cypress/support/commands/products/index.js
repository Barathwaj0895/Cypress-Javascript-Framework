import * as productsPage from "../../pages/productsPage"
import * as productDescPage from "../../pages/productDescPage"

Cypress.Commands.add('selectProduct', (product, withVariant = false) => {
  cy.intercept(`GET`, `https://**/client-session`).as(`waitClientSessionApi`)
  if (withVariant) {
    cy.log(`Select '${product}' having variants`)
  } else {
    cy.log(`select '${product}' product`)
  }
  productsPage.getProductName_link()
    .contains(new RegExp("^" + product + "$"))
    .trigger('click')
  cy.wait('@waitClientSessionApi', { timeout: 60000 }).then(interception => {
    cy.wrap(interception.response.statusCode).should('be.eq', 200)
  })
})

//product quick view
Cypress.Commands.add('openProductQuickView', (product) => {
  if (product !== undefined) {
    cy.log(`Open quick view of ${product}`)
    productsPage.getQuickView_btn(product)
      .first()
      .click({ force: true })
  } else {
    cy.log('Open quick view')
    productsPage.getQuickView_btn()
      .first()
      .click({ force: true })
  }
  cy.log('Verify quick view panel is opened')
  productsPage.getModalDialogClose_btn()
    .should('be.visible')
})

Cypress.Commands.add('closeProductQuickView', () => {
  cy.log('Close quick view dialog')
  productsPage.getModalDialogClose_btn()
    .should('be.visible')
    .click()
})

Cypress.Commands.add('selectShadeFromQuickView', () => {
  cy.log('Verify a shade is selected from the list of shades')
  productsPage.getQuickView_panel()
    .should('be.visible')
    .within(() => {
      productsPage.getVariantList_btn()
        .should('be.visible')
        .find('button')
        .click({ multiple: true })
        .last()
        .click()
        .should('have.attr', 'aria-selected', 'true')
    })
})


Cypress.Commands.add('verifyCarousalImagesAreDisplayed', () => {
  cy.log('Verify Carousal Images')
  if (Cypress.env('device') === "") {
    productsPage.getQuickViewImages_panel()
      .first()
      .find('button[aria-label^="Carousel image"]')
      .click({ multiple: true })
      .last()
      .should('be.visible')
      .should('have.attr', 'aria-selected', 'true')
  } else {
    cy.wait(3000).scrollTo('top', { ensureScrollable: false })
    productsPage.getMobileQuickViewImages_panel()
      .first()
      .click({ multiple: true }).wait(2000)
      .should('be.visible')
  }
})

Cypress.Commands.add('getQuickViewProductTitle', () => {
  cy.log('Get the product title in quick view panel')
  productsPage.getQuickViewProdTitle_h2()
    .should('be.visible')
    .then(title => {
      const prodTitle = Cypress.$(title).text()
      return cy.wrap(prodTitle)
    })
})

Cypress.Commands.add('checkSetItemsPresenceInQuickView', () => {
  cy.log('Verify set items are present in quick view')
  cy.intercept('POST', 'https://api.segment.io/v1/t').as('waitToCheckProductType')
  cy.openProductQuickView()
  cy.wait('@waitToCheckProductType', { timeout: 60000 })
    .then(interception => {
      cy.wrap(interception.response.statusCode).should('be.eq', 200)
      if (JSON.parse(interception.request.body).properties.kit_id !== undefined) {
        productsPage.getQuickViewWrapper_panel()
          .find('a')
          .should('have.length.gte', 2)
      }
    })
})

Cypress.Commands.add('verifySetItemsInQuickView', (oneOrAll = undefined, product = "The 3-Step Skincare Routine") => {
  cy.log('verify set items from quick view')
  cy.intercept('POST', 'https://api.segment.io/v1/t').as('waitToCheckProductType')
  cy.openProductQuickView(product)
  cy.wait('@waitToCheckProductType', { timeout: 60000 })
    .then(interception => {
      cy.wrap(interception.response.statusCode).should('be.eq', 200)
      if (JSON.parse(interception.request.body).properties.kit_id !== undefined) {
        productsPage.getQuickViewWrapper_panel()
          .find('a')
          .then(prods => {
            if (oneOrAll === undefined || oneOrAll === 'One') {
              cy.verifyLink(productsPage.getQuickViewWrapper_section_locator, 0)
              cy.go('back')
              cy.openProductQuickView(product)
            } else {
              const prodsCount = Cypress.$(prods).length
              for (let a = 0; a < prodsCount; a++) {
                cy.verifyLink(productsPage.getQuickViewWrapper_section_locator, a)
                cy.go('back')
                cy.openProductQuickView(product)
              }
            }
          })
      }
    })
})

Cypress.Commands.add('openProductWithNoVariantInQuickView', () => {
  cy.log('Open quick view')
  productsPage.getAllProductsWithNoVariant()
    .first()
    .find('button[aria-label*="quick view modal"]')
    .click({ force: true })
  cy.log('Verify quick view panel is opened')
  productsPage.getModalDialogClose_btn()
    .should('be.visible')
})

Cypress.Commands.add('openProductWithVariantInQuickView', () => {
  cy.log('Open quick view')
  productsPage.getAllProductsWithVariant()
    .first()
    .find('button[aria-label*="quick view modal"]')
    .click({ force: true })
  cy.log('Verify quick view panel is opened')
  productsPage.getModalDialogClose_btn()
    .should('be.visible')
})