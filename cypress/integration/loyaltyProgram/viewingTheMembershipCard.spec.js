import { getTestHooks } from "../../support/hooks"
import * as profilepage from "../../support/pages/profilePage"
const loyaltyProgramUsers = require("../../fixtures/viewDetailsOfLoyaltyUser.json")

loyaltyProgramUsers.forEach((loyaltyProgramUsers) => {
    describe("Viewing the mebership card details", { tags: ['Production','Loyalty'] }, () => {
        getTestHooks()

        it('Login with Loyalty Program user Credentials', () => {
            cy.visit(Cypress.config('baseUrl'))
            cy.loginUsingApis(loyaltyProgramUsers)
            cy.reload()
            cy.OpenProfilePanel()
            cy.log('Login Successfull');
        })

        it('Validate the badge name', () => {
            cy.reload()
            cy.OpenProfilePanel()
            profilepage.getMemberCardBadgeName_txt()
            .should('have.text', `${loyaltyProgramUsers.badge_name}`)
        })

        it('Validate the membership date', () => {
            profilepage.getMemberCardJoining_txt()
            .should('have.text', `${loyaltyProgramUsers.member_since}`)
        })
        

        it('Validate points', () => {
            profilepage.getMemberCardPoints_txt()
            .should('have.text', `${loyaltyProgramUsers.points}`)
        })

        it('Validate the current membership tier and next level info', () => {
            profilepage.getMemberCardTier_txt()
            .should('have.text', `${loyaltyProgramUsers.tier}`)
            profilepage.getMemberCardNextTier_txt()
            .should('have.text', `${loyaltyProgramUsers.next_level_tier_message}`)
        })
        it('Validate link to profile page', () => {
            profilepage.getMemberCardManageProfile_link()
            .should('have.text', 'My Membership')
            .focus()
            .click()
        })

        it('Validate the profile page', () => {
            profilepage.getProfileBenifitsHeader_txt()
            .should('be.visible')
        })
    })
})