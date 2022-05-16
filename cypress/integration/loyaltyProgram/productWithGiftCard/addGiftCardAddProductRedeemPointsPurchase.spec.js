import { getTestHooks } from "../../../support/hooks"
const viewDetailsOfLoyaltyUser = require("../../../fixtures/viewDetailsOfLoyaltyUser.json")

describe('Add gift card and add product then use Loyalty Redeem Points', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()
    it('Login with Loyalty Program user Credentials', () => {
        cy.visit('/products/gift-card')
        cy.loginWithUserCredentials(viewDetailsOfLoyaltyUser[0])
    })

    it('add gift card', () => {
        cy.clearCart()
        let date = ""
        cy.getTodaysDate().then(($date) => date = $date)
        cy.fixture("giftCard").then((giftCard) => {
            cy.fillGiftCardDetails(giftCard.card, date)
        })
    })

    it('Selecting the product', () => {
        cy.visit('/products')
        cy.selectProduct('Balm Dotcom', true)
    })

    it('Add product to bag', () => {
        cy.selectVariant('Balm Dotcom', 'Coconut')
        cy.addToBag()
    })

    it('Validate points more than product worth can not be availed', () => {
        cy.validatePointsCanNotBeAvailedMoreThanProductWorth()
    })

    it('Use Pay with Points for Product Purchase', () => {
        viewDetailsOfLoyaltyUser[0].spendable_amount = "$5 (100 points)"
        cy.selectPayWithPointsForRedeemFlow(viewDetailsOfLoyaltyUser[0].spendable_amount)
        cy.validatePayWithPointsAmountIsAppliedInTotalBill()
    })

    it('Go to checkout', () => {
        cy.continueToCheckout()
        cy.verifyUrl('checkout')
        cy.verifyShippingMessage()
    })

    it('Confirm shipping address', () => {
        cy.fixture('address').then(address => {
            cy.selectOrAddAddress(address.US)
        })
        cy.clickOnNextOnAddBook()
        cy.verifyDeliveryMessage()
    })

    it('Confirm delivery method', () => {
        cy.selectShippingOption("Standard (6-8 business days)")
        cy.clickOnNextOnDeliveryMethod()
    })

    it('Confirm Payment process', () => {
        cy.fixture('creditCards').then(creditCards => {
            cy.selectOrAddPayment(creditCards.passing)
        })
        cy.clickOnNextOnPayment()
        cy.verifyReviewMessage()
    })

    it('Place Order', () => {
        cy.placeOrder()
        cy.verifyOrderPlacedMessage()
    })
})