import { getTestHooks } from "../../support/hooks"
const loyaltyProgramUsers = require("../../fixtures/loyaltyProgramUsers.json")
import * as profilePage from '../../support/pages/profilePage'

describe('Validate Inputs of First Name and Birthday', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()

    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginUsingApis(loyaltyProgramUsers[1])
        cy.unenrollUserFromLoyaltyProgram()
        cy.reload()
    })

    it('Validate Loyalty Banner is seen and click on Join for Free Button', () => {
        cy.OpenProfilePanel()
        cy.validateLoyaltyBanner("Join Glossier Membership")
        cy.clickButton("Join now")
    })

    it('Validate Glossier Membership Banner and Click On JoinUs Button', () => {
        cy.validateGlossierMembershipPanelElements()
        cy.clickButton('Join us')
    })

    it('Validate the First Name is same as during account creation', () => {
        profilePage.getUserName_txtBox().should('have.value', loyaltyProgramUsers[1].firstName)
            .log('First Name is same as provided during account creation')
    })

    it('Validate the error message when incorrect first name or birthday date is provided', () => {
        cy.fillMembershipForm(loyaltyProgramUsers[1].firstName, 'April', '31')
        profilePage.getBirthDayError_txt().should('be.visible')
        profilePage.getFirstNameBlankError_txt().contains('First Name is required').should('not.exist')
        cy.log("User will not be able to enroll to Loyalty when Invalid details are given")
    })

    it('Validate First Name Error Message when Empty String is Passed', () => {
        cy.fillMembershipForm("", 'November', '31')
        profilePage.getFirstNameBlankError_txt().should('be.visible')
        profilePage.getBirthDayError_txt().should('be.visible')
    })
})