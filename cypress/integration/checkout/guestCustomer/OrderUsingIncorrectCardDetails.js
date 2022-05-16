import { getTestHooks } from "../../../support/hooks"
const invalidCardDetails = require("../../../fixtures/IncorrectCardDetails.json")

invalidCardDetails.forEach((cardDetail) => {
    describe(`Trying to order a product with ${cardDetail.title} and validate it throws error`, { tags: ['P2'] }, () => {
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

        it('Enter the card details', () => {
            cy.fillCheckoutFormPayment(cardDetail)
            cy.fillCheckoutFormEmail()
            cy.clickreviewButton()
        })

        it('Validate the error message', () => {
            let cardTitle = cardDetail.title
            if (cardTitle.includes("Declined")) {
                cy.placeOrder()
            }
            cy.verifyErrorMessage(cardDetail.ErrorMessage)
        })
    })
})