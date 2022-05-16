import { getTestHooks } from "../../support/hooks"
const viewDetailsOfLoyaltyUser = require("../../fixtures/viewDetailsOfLoyaltyUser.json")
const creditCards = require("../../fixtures/creditCards.json")
import * as checkoutPage from "../../support/pages/checkoutPage"

describe('Glossy tier user with 1pt to 99pts, should not have Drop Down for pay with points available.', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()
    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginWithUserCredentials(viewDetailsOfLoyaltyUser[1])
    })

    it('Select the Product and Add to bag', () => {
        cy.selectProduct('The Essential Edit', true)
        cy.wait(4000)
        cy.reload()
        cy.clearCart()
        cy.addToBag()
    })

    it('Validate Pay With Points Banner is seen and Points are 1 to 99', () => {
        cy.verifyPayWithPointsBannerAvailableFor0to99Points("Almost there! You don't quite have enough points to redeem", "99")
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