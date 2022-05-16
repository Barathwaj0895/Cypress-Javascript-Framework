import { getTestHooks } from "../../support/hooks"
const loyaltyProgramUsers = require("../../fixtures/loyaltyProgramUsers.json")

describe('Glossi-er Tier User with 110 points, should have only $5(100 Points) Drop Down for pay with points.', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()
    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginWithUserCredentials(loyaltyProgramUsers[1])
    })

    it('Select the Product and Add to bag', () => {
        cy.selectProduct('The Essential Edit', true)
        cy.wait(4000)
        cy.reload()
        cy.clearCart()
        cy.addToBag()
    })

    it('Validate Pay With Points options are seen according to the User Tier', () => {
        cy.validatePayWithPointsIsSeenAccordingToTheUserTier(loyaltyProgramUsers[1].spendablePoints)
        cy.selectPayWithPointsForRedeemFlow(loyaltyProgramUsers[1].spendableAmount)
        cy.validatePayWithPointsAmountIsAppliedInTotalBill()
    })

    it('Go to checkout', () => {
        cy.continueToCheckout()
        cy.verifyUrl('checkout')
        cy.verifyShippingMessage()
    })

    it('Confirm shipping address', () => {
        cy.validateAndFillShippingDetails()
    })

    it('Confirm delivery method', () => {
        cy.selectShippingOption("Standard (6-8 business days)")
        cy.clickOnNextOnDeliveryMethod()
    })

    it('Confirm Payment process', () => {
        cy.validateAndAddPaymentDetails()
    })

    it('Place Order', () => {
        cy.placeOrder()
        cy.verifyOrderPlacedMessage()
    })
})