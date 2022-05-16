import { getTestHooks } from "../../support/hooks"
import * as profilepage from "../../support/pages/profilePage"
const loyaltyProgramUsers = require("../../fixtures/viewDetailsOfLoyaltyUser.json")

loyaltyProgramUsers.forEach((loyaltyProgramUser) => {
    describe("Viewing the profile details", { tags: ['Production','Loyalty'] }, () => {
        getTestHooks()

        it('Login with Loyalty Program user Credentials', () => {
            cy.visit(Cypress.config('baseUrl'))
            cy.loginUsingApis(loyaltyProgramUser)
            cy.reload()
            cy.OpenProfilePanel()
            cy.log('Login Successfull');
        })

        it('Validate and click link to profile page', () => {
            cy.reload()
            cy.OpenProfilePanel()
            profilepage.getMemberCardManageProfile_link()
            .should('have.text', 'My Membership')
            .focus()
            .click()
        })
        
        it('Validate the profile name', () => {
            profilepage.getProfileName_txt()
            .should('have.text', `${loyaltyProgramUser.badge_name}`)
        })
        it('Validate the member since details', () => {
            profilepage.getProfileMemberSince_txt()
            .should('have.text', `${loyaltyProgramUser.profile_member_since}`)    
        })

        it('Validate the edit profile link', () => {
            profilepage.getEditProfile_link()
            .should('be.visible')    
        })

        it('Validate points', () => {
            profilepage.getProfilePoints_txt()
            .should('have.text', `${loyaltyProgramUser.points}`)
        })

        it('Validate the current membership tier and next level info', () => {
            profilepage.getProfileCurrentTier_txt()
            .should('contain', `${loyaltyProgramUser.tier}`)
            profilepage.getProfileNextTier_txt()
            .should('have.text', `${loyaltyProgramUser.next_level_tier_message}`)
        })
        
        
        it('Validate just for you section', () => {
            profilepage.getJustForYou_section()
            .should('be.visible')
        })
        

        it('Validate pay with points section', () => {
            profilepage.getPayWithPoints_section()
            .should('be.visible')
        })

        it('Validate the benifits header', () => {
            profilepage.getProfileBenifitsHeader_txt()
            .should('be.visible')
        })

        it('Validate need help', () => {
            profilepage.getProfileNeedHelp_section()
            .should('be.visible')
        })
    })
})