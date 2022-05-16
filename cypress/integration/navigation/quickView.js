import { getTestHooks } from "../../support/hooks"

describe('Quick View Modal Functional Tests', { tags: ['Regression', 'Production'] }, () => {
  getTestHooks()
  it('Validate sucessfully navigated to makeup products', () => {
    cy.visit('/')
    cy.verifyPageLoaded()
    cy.selectMenuCategory('Makeup')
    cy.verifyUrl('makeup')
  })

  it('Triggers Quick View Modal', () => {
    cy.openProductWithVariantInQuickView()
  })

  it('Select a Shade', () => {
    cy.selectShadeFromQuickView()
  })

  it('Add and Remove product quantity', () => {
    for (let i = 0; i < 2; i++) {
      cy.selectShadeFromQuickView()
      cy.addQuantity();
    }
    cy.getItemQuantity().should('contain', 3)
    cy.removeQuantity()
    cy.getItemQuantity().should('contain', 2)
  })

  it('Validate Carousel images', () => {
    cy.verifyCarousalImagesAreDisplayed()
  })

  it('Add to bag', () => {
    cy.getQuickViewProductTitle()
      .then(prodTitle => {
        cy.addToBag({ screen: 'Quickview'})
        cy.verifyProductTitleInCart(prodTitle)
      })
  })
})
