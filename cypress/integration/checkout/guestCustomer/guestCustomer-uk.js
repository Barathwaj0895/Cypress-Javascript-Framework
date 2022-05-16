import { getTestHooks } from "../../../support/hooks"

describe('Change the Locale to UK and Checkout a product as a guest user', { tags: ['Regression', 'Production'] }, () => {
    getTestHooks()

    it('Logon to the glossier Products', () => {
        cy.visit('/products')
        cy.verifyPageLoaded()
    })

    it('Changing the locale', () => {
        cy.clickOnMenu()
        cy.fixture('address').then(address => {
            cy.changeLocale(address.UK)
        })
    })

    it('Clicking on the product', () => {
        cy.selectProduct('Lash Slick', true)
    })

    it('Add product to bag', () => {
        cy.addToBag()
    })

    it('Go to checkout', () => {
        cy.continueToCheckout()
    })

    it('Continue as Guest', () => {
        cy.agreeTerms()
        cy.checkoutAsGuest()
    })

    it('Adding Address for Guest Checkout', () => {
        cy.fixture('address').then(address => {
            cy.fillCheckoutFormAddress(address.UK)
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