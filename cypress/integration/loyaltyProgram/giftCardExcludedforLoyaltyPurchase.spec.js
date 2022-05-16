import { getTestHooks } from "../../support/hooks"
import * as cartPage from "../../support/pages/cartPage"
const viewDetailsOfLoyaltyUser = require("../../fixtures/viewDetailsOfLoyaltyUser.json")

describe('Pay With Points should not be available when User purchases only GiftCard', { tags: ['Production','Loyalty'] }, () => {
    getTestHooks()
    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginWithUserCredentials(viewDetailsOfLoyaltyUser[0])
    })

    it('Open Menu', () => {
        cy.openMenu()
    })

    it('Select Gift Card', () => {
        cy.selectCategory('Digital Gift Card')
    })

    it('Fill in gift card details', () => {
        cy.clearCart()
        let date = ""
        cy.getTodaysDate().then(($date) => date = $date)
        cy.fixture("giftCard").then((giftCard) => {
            cy.fillGiftCardDetails(giftCard.card, date)
        })
        cy.waitForTheApiResponse({ name: 'waitForPaypalApi', method: 'POST', url: 'https://c.**paypal.com/**' })
    })

    it('Verify Pay With Points Banner/Label should not be Present inside the Cart', () => {
        cartPage.getPayWithPoints_txt().should('not.exist')
    })

    it('Selecting the product and add product to bag', () => {
        cy.visit('/products')
        cy.selectProduct('Priming Moisturizer Balance', true)
        cy.addToBag()
    })

    it('Validate points more than product worth can not be availed', () => {
        cy.validatePointsCanNotBeAvailedMoreThanProductWorth()
    })

    it('Use and validate Pay with Points for Product Purchase', () => {
        viewDetailsOfLoyaltyUser[0].spendable_amount = "$20 (400 points)"
        cy.selectPayWithPointsForRedeemFlow(viewDetailsOfLoyaltyUser[0].spendable_amount)
        cartPage.getPayWithPoints_txt().should('exist')
    })

    // This validation will fail due to the issue "Bug Id: 71574"
    it('Remove product and validate Pay with points has been removed from Billing section', () => {
        cartPage.getCartProductRemove_txt("Priming Moisturizer Balance").should('be.visible').click()
        cartPage.getPayWithPoints_txt().should('not.exist')
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