import { getTestHooks } from "../../support/hooks"
const loyaltyProgramUsers = require("../../fixtures/loyaltyProgramUsers.json")

loyaltyProgramUsers.forEach((loyaltyProgramUsers) => {
    describe(loyaltyProgramUsers.title, { tags: ['Production','Loyalty'] }, () => {
        getTestHooks()

        it('UnEnroll User from Loyalty Program', () => {
            cy.unenrollUserFromLoyaltyProgram()
        })

        it('Login with Loyalty Program user Credentials', () => {
            cy.visit(Cypress.config('baseUrl'))
            if (loyaltyProgramUsers.tier === "Glossy") {
                cy.OpenProfilePanel()
                cy.createUserAccount('Milo', 'John', loyaltyProgramUsers.password)
            } else {
                cy.loginUsingApis(loyaltyProgramUsers)
            }
            cy.reload()
            cy.OpenProfilePanel()
            cy.log('User Logged In Successfull');
        })

        it('Validate Loyalty Banner is seen and click on Join for Free Button', () => {
            cy.validateLoyaltyBanner("Join Glossier Membership")
            cy.clickButton("Join now")
        })

        it('Validate Glossier Membership Banner and Click On JoinUs Button', () => {
            cy.validateGlossierMembershipPanelElements()
            cy.clickButton('Join us')
        })

        it('Fill Membership Form and click on Join Us Button', () => {
            cy.fillMembershipForm('Automation user', 'July', '3')
        })

        it(`verify ${loyaltyProgramUsers.tier} Tier is visible`, () => {
            cy.reload()
            cy.verifyMembershipTier(loyaltyProgramUsers.tier)
        })
    })
})