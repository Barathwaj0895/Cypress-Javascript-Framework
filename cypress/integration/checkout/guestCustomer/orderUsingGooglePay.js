import { getTestHooks } from "../../../support/hooks"

/*
* Any Browser, Mobile, Signed-Out, Frictionless
*/
describe('Checkout a product with google pay', { tags: ['Regression'] }, () => {
    getTestHooks()

    it('Visit products page', () => {
        cy.visit('/products')
        cy.verifyPageLoaded()
    })

    it('Select any product', () => {
        cy.selectProduct('Invisible Shield')
    })

    it('Add product to bag', () => {
        cy.addToBag({ paymentMode: 'GooglePay' })
    })

    it('Checkout using google pay', () => {
        cy.checkoutUsingGooglePay()
    })
    
    it('Verify order placed', () => {
        cy.verifyOrderPlacedMessage()
    })
})
