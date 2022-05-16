import { getTestHooks } from "../../support/hooks"

describe('Product sizes functional tests', { tags: ['Regression', 'Production'] }, () => {
  getTestHooks()

  it('Navigates to PLP', () => {
    cy.visit('/products')
    cy.verifyUrl('products')
    cy.verifyPageLoaded()
  })

  it('Open product having no variant in QV', () => {
    cy.openProductWithNoVariantInQuickView()
    cy.validateModalView()
  })

  it('Select size & Add to bag from QV', () => {
    cy.addToBag({ screen: "Quickview" })
  })

  it('Select Size from PLP & Add to bag', { tags: ['Regression'] }, () => {
    cy.closeCartButton()
    cy.selectSizeFromPlpAndClickAddToBag('glossier-sweatshirt')
    cy.validateStyledBlade('Glossier Sweatshirt')
  })
})
