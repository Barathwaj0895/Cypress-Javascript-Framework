import { getTestHooks } from "../../support/hooks"
const viewDetailsOfLoyaltyUser = require("../../fixtures/viewDetailsOfLoyaltyUser.json")

describe('Purchase a product and use Loyalty Redeem Points ', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()
    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginWithUserCredentials(viewDetailsOfLoyaltyUser[0])
    })

    it('Selecting the product', () => {
        cy.selectProduct('The Essential Edit', true)
        cy.wait(4000)
    })

    it('Add product to bag', () => {
        cy.reload()
        cy.clearCart()
        cy.addToBag()
    })

    it('Use Pay with Points for Product Purchase', () => {
        cy.selectPayWithPointsForRedeemFlow(viewDetailsOfLoyaltyUser[0].spendable_amount)
        cy.validatePayWithPointsAmountIsAppliedInTotalBill()
    })

    it('Go to checkout', () => {
        cy.continueToCheckout()
        cy.verifyUrl('checkout')
        cy.verifyShippingMessage()
    })

    it('Confirm shipping address', () => {
        cy.editShippingAddress()
        cy.verifyDeliveryMessage()
    })

    it('Confirm delivery method', () => {
        cy.selectShippingOption("Standard (6-8 business days)")
        cy.clickOnNextOnDeliveryMethod()
    })

    it('Confirm Payment process', () => {
        cy.editPaymentForAddingNewCardDetails()
        cy.verifyReviewMessage()
    })

    it('Place Order', () => {
        cy.placeOrder()
        cy.verifyOrderPlacedMessage()
    })
})