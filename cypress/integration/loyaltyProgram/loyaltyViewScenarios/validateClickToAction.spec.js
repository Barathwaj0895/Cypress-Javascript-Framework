import { getTestHooks } from "../../../support/hooks"
const loyaltyProgramUsers = require("../../../fixtures/loyaltyProgramUsers.json")
import * as profilePage from '../../../support/pages/profilePage'
import * as cartPage from '../../../support/pages/cartPage'
 

describe('Validate Message card with action CTA', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()

    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginWithUserCredentials(loyaltyProgramUsers[2])
    })

    it('Select to Double Points Card and Validate user is redirected to PDP', () => {
        cy.clickAccountToggleAndOpenMembershipPanel()
        cy.validateCTA("right", "Double Points", "Earn 2x points on Cleanser Concentrate")
        profilePage.getCTA_btn("a").should('be.visible').contains('Shop Now').click()
        cy.url().should('include', "/products/cleanser-concentrate")
    })

    it('Select Welcome Gift Card and validate Cart Page is Seen', () => {
        cy.clickAccountToggleAndOpenMembershipPanel()
        cy.validateCTA("right", "Welcome Kit", "Claim your Member Welcome Gift")
        profilePage.getCTA_btn("button").should('be.visible').contains('Claim your Welcome Gift').click()
        cartPage.getCartObject_panel().should('be.visible')
        cy.closeCartButton()
    })

    it('Select Birthday Gift Card and Validate User is redirected to Products Page', () => {
        cy.clickAccountToggleAndOpenMembershipPanel()
        cy.validateCTA("left", "Happy Birthday", "Claim your Birthday Bonus Points")
        profilePage.getCTA_btn("a").should('be.visible').contains('Shop now').click()
        cy.url().should('include', "/products")
    })
})