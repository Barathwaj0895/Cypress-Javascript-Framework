import { getTestHooks } from "../../support/hooks"
const viewDetailsOfLoyaltyUser = require("../../fixtures/loyaltyViewUsers.json")

viewDetailsOfLoyaltyUser.forEach(user => {
    describe(`Validate pay with points off shown as expected for user having ${user.spendablePoints} on membership screen`, { tags: ['Production', 'Loyalty'] }, () => {
        getTestHooks()

        it('Login with Loyalty Program user Credentials', () => {
            cy.visit(Cypress.config('baseUrl'))
            cy.loginUsingApis(user)
            cy.reload()
            cy.OpenProfilePanel()
            cy.log('Login Successfull');
        })

        it('Validate off shown against the points available', () => {
            cy.amountThatCanBeAvailedAgainstPoints()
        })

        it('Validate user can expands - how do i earn points', () => {
            cy.verifyHowDoIEarnPoints()
        })
    })
})
