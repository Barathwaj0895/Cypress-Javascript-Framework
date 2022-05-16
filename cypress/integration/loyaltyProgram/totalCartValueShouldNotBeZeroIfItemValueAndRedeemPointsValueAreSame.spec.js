import { getTestHooks } from "../../support/hooks"
const viewDetailsOfLoyaltyUser = require("../../fixtures/viewDetailsOfLoyaltyUser.json")

describe('Order Total shoud not be free if Product Value and Pay with Points are of same amount', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()
    it('Login with Loyalty Program user Credentials', () => {
        cy.visit('/products')
        cy.loginWithUserCredentials(viewDetailsOfLoyaltyUser[0])
    })

    it('Select the Product and Add to bag', () => {
        cy.selectProduct('Cleanser Concentrate', true)
        cy.wait(4000)
        cy.reload()
        cy.clearCart()
        cy.addToBag()
    })

    it('Validate Pay With Points options are seen according to the User Tier', () => {
        cy.selectPayWithPointsForRedeemFlow(viewDetailsOfLoyaltyUser[0].spendable_amount)
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
        cy.validateTotalOrderAmountShouldNotBeZero("$ 0.0")
        cy.placeOrder()
        cy.verifyOrderPlacedMessage()
    })

})