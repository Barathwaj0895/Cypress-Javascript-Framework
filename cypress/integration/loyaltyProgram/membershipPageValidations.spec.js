import { getTestHooks } from "../../support/hooks"
const viewDetailsOfLoyaltyUser = require("../../fixtures/viewDetailsOfLoyaltyUser.json")

describe('Automate Loyalty Membership Page and Validate its features', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()

    it('Login with Loyalty Program user Credentials', () => {
        cy.visit(Cypress.config('baseUrl'))
        cy.loginWithUserCredentials(viewDetailsOfLoyaltyUser[0])
    })

    it('Validate Membership Page Contents', () => {
        cy.validateMembershipBannerDetails("Pay with points", "For every 100 points, get $5 off your order.")
    })

    it('validate Membership points are calculated accordingly', () => {
        cy.validateMembershipPointsAvailabilityDetails()
    })

    it('Validate Offers Banner And Apply To Bag', () => {
        cy.validateOfferBannerDetailsAndApplyToBag()
    })
})