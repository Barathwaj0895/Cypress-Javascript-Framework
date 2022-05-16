import { getTestHooks } from "../../../support/hooks"

/*
* Any Browser, Mobile, Signed-In (repeat purchaser), Legacy, Gift Card
*/
describe('Checkout a gift card by signing in with the account having an order completed in past', { tags: ['Regression'] }, () => {
    getTestHooks()

    it('Sign in with user already completed order in past', () => {
        cy.fixture('user').then(user => {
            cy.visit('/products')
            cy.verifyPageLoaded()
            cy.loginUsingApis(user)
        })
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

    it('Go to checkout', () => {
        cy.continueToCheckout()
        cy.verifyUrl('checkout')
        cy.verifyPaymentMessage()
    })

    it('Confirm credit card', () => {
        cy.selectCardPaymentMethod()
        cy.clickOnNextOnPayment()
        cy.verifyReviewMessage()
    })

    it('Place Order', () => {
        cy.placeOrder()
        cy.verifyOrderPlacedMessage()
    })
})