import { getTestHooks } from "../../../support/hooks"

/*
* Chrome, Desktop, Signed-In (repeat purchaser), Legacy, Variant SKU
*/
describe('Checkout a product with variant by signing in with the account having an order completed in past', { tags: ['Regression'] }, () => {
    getTestHooks()

    it('Sign in with user already completed order in past', () => {
        cy.fixture('user').then(user => {
            cy.visit('/products')
            cy.verifyPageLoaded()
            cy.loginUsingApis(user)
        }) 
    })

    it('Open any SKU variant product', () => {
        cy.selectProduct('Balm Dotcom', true)
    })

    it('Select a variant', () => {
        cy.selectVariant('Balm Dotcom', 'Coconut')
    })

    it('Add product to bag', () => {
        cy.clearCart()
        cy.addToBag()
    })

    it('Go to checkout', () => {
        cy.continueToCheckout()
        cy.verifyUrl('checkout')
        cy.verifyShippingMessage()
    })

    it('Confirm shipping address', () => {
        cy.selectExistSelectedAdd()
        cy.clickOnNextOnAddBook() 
        cy.verifyDeliveryMessage()
    })

    it('Confirm delivery method', () => {
        cy.selectShippingOption("Standard (5-7 business days)")
        cy.clickOnNextOnDeliveryMethod() 
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