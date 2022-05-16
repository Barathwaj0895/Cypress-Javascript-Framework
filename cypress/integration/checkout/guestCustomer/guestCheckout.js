import { getTestHooks } from "../../../support/hooks"

describe('Checkout a product as a guest user', { tags: ['Regression'] }, () => {
    getTestHooks()

    it('Visit glossier product page', () => {
        cy.visit('/products')
        cy.verifyPageLoaded()
    })

    it('Clicking on the product', () => {
        cy.selectProduct('Invisible Shield')
    })

    it('Add product to bag', () => {
        cy.addToBag()
    })

    it('Go to checkout', () => {
        cy.continueToCheckout()
    })

    it('Continue as Guest', () => {
        cy.checkoutAsGuest()
    })

    it('Adding Address for Guest Checkout', () => {
        cy.fixture('address').then(address => {
            cy.fillCheckoutFormAddress(address.US)
        })
        cy.clickOnNextOnAddBook()
    })

    it('Select delivery method', () => {
        cy.selectShippingOption("Standard (5-7 business days)")
        cy.clickOnNextOnDeliveryMethod() 
        cy.verifyPaymentMessage()
    })

    it('Filling the Card Details', () => {
        cy.fixture('creditCards').then(creditCards => {
            cy.fillCheckoutFormPayment(creditCards.passing)
        })
        cy.fillCheckoutFormEmail()
        cy.verifyReviewMessage()
        cy.clickreviewButton()
    })

    it('Place the order and confirm order is placed', () => {
        cy.placeOrder()
        cy.verifyOrderPlacedMessage()
    })
})