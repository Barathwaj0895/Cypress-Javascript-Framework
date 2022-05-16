import { getTestHooks } from "../../../support/hooks"
const storePickupAddress = require("../../../fixtures/addressStorePickup.json")

storePickupAddress.forEach((address) => {

    describe(`Checkout a product as a guest user from city - ${address.city} and validate Store Pickup Delivery Method ${address.storePickup}`, { tags: ['Regression'] }, () => {
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
            cy.fillCheckoutFormAddress(address)
            cy.clickOnNextOnAddBook()
        })

        it(`Validate Store Pickup Delivery Method ${address.storePickup}`, () => {
            if (address.storePickup === "should exists") {
                cy.validateShippingOption('include.text', "Store Pickup (ASAP)")
                cy.selectShippingOption("Store Pickup (ASAP)")
            }
            else {
                cy.validateShippingOption('not.contain', "Store Pickup (ASAP)")
                cy.selectShippingOption("Standard (5-7 business days)")
            }
            cy.clickOnNextOnDeliveryMethod()
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
})