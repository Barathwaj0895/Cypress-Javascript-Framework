import { getTestHooks } from "../../support/hooks"
describe('Write a Product Review', { tags: ['Regression'] }, () => {
    getTestHooks()
    it('Logon to the glossier Products', () => {
        cy.visit('/products')
    })

    it('Clicking on the product', () => {
        cy.selectProduct('Lash Slick', true)
    })

    it('Click on Review button', () => {
        cy.clickOnReviewButton()
    })

    it('Write Product Review', () => {
        cy.fillReviewForm('About Nature and Safety of Product', 'Good Product and Safe to Use ', '5', 'John Mcullum', 'glossierqa@gmail.com')
    })

    it('Click on Submit Button', () => {
        cy.clickOnSubmitBtn()
    })

    it('Validate Review Complete Banner', () => {
        cy.validateReviewCompleteBanner()
    })
})