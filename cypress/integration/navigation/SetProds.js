import { getTestHooks } from "../../support/hooks"

describe('Set Products Functional Tests', { tags: ['Regression', 'Production'] }, () => {
  getTestHooks()
  it('Opens Set products quickview on PLP and carousel images', () => {
    cy.visit('/')
    cy.selectMenuCategory('Shop our Sets')
    cy.verifyUrl('sets')
    cy.checkSetItemsPresenceInQuickView()
    cy.verifyCarousalImagesAreDisplayed()
    cy.closeProductQuickView()
  })

  it('Navigates to set PDP from QV', () => {
    cy.verifySetItemsInQuickView()
    cy.closeProductQuickView()
  })

  it('Navigates to each PDP of set', () => {
    cy.verifySetItemsInQuickView('All')
  })

  it('Add and validate the selected product title', () => {
    cy.getQuickViewProductTitle()
      .then(productTitle => {
        cy.addToBag({ screen: 'SetsPDP' })
        cy.verifyProductTitleInCart(productTitle)
      })
  })
})