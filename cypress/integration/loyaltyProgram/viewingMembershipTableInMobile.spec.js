import { getTestHooks } from "../../support/hooks"
const loyaltyProgramUsers = require("../../fixtures/viewDetailsOfLoyaltyUser.json")

describe("Validate membership table selected", { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()

    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginUsingApis(loyaltyProgramUsers[0])
        cy.reload()
        cy.OpenProfilePanel()
        cy.log('Login Successfull');
    })

    it('Validate current tier is highlighted in the membership table', () => {
        cy.validateMembershipTableSelected()
    })
})
