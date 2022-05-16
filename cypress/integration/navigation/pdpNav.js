import { getTestHooks } from "../../support/hooks"

describe('PDP Functional Tests', { tags: ['Regression', 'Production'] }, () => {
  getTestHooks()

  it('Navigates successfully to PLP', () => {
    cy.visit('/')
    cy.selectMenuCategory('Makeup')
    cy.verifyUrl('makeup')
  })

  it('Navigates successfully to PDP', () => {
    cy.getProductCardImagesWrapper()
  })

  it('Add 1 quantity', () => {
    cy.addQuantity()
    cy.validatingTotalAmount()
  })

  it('Remove 1 quantity ', () => {
    cy.removeQuantity()
    cy.validatingTotalAmount()
  })

  it('Validating Carousal Image', () => {
    cy.verifyCarousalImagesAreDisplayed()
  })

  it('Add Item to Bag and Validate', () => {
    cy.validateAddToBag_pdp('Glossier You')
  })
})
