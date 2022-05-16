import { getTestHooks } from "../../support/hooks"
const loyaltyAPI = require("../../fixtures/loyaltyAPI.json")
let LOYALTY_API_BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQyNDg0OTgsImVtYWlsIjoiY2FwYWNpdHktOTk5MDA0LXRlc3RAZ2xvc3NpZXIuY29tIiwiY3VzdG9tZXJJZCI6IjFjNjAwOTdlLTVkMzgtNGUzNi1iZmRiLWM2ZjNhMmFhYjcyMCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNjQwMTAzOTEwLCJleHAiOjE2NzE2NjE1MTAuMCwic2lkIjoiXCI5OTQxZGEzYS03ZDQwLTRiY2YtOWFiNS0wZTc3Y2Y4ODRlZjRcIiJ9.sux128i0PZqzt438BJTZxVLNFPRwxdQW7P4i7Xv7rf0"

describe('Validation of Loyalty APIs', { tags: ['Production', 'Loyalty'] }, () => {
    getTestHooks()
})

it('Validate GETMessage Loyalty API', () => {
    cy.validateGetMessagesGetAPI(loyaltyAPI.getMessages, LOYALTY_API_BEARER_TOKEN)
})

it('Validate GETOffer Loyalty API', () => {
    cy.validateGetOfferGetAPI(loyaltyAPI.getOffer, LOYALTY_API_BEARER_TOKEN)
})

it('Validate GETOffers Loyalty API', () => {
    cy.validateGetOffersGetAPI(LOYALTY_API_BEARER_TOKEN)
})

it('Validate GETViewProfile Loyalty API', () => {
    cy.validateViewProfileGetAPI(LOYALTY_API_BEARER_TOKEN)
})

it('Validate POSTRedeemOffer Loyalty API', () => {
    cy.validatePostRedeemOffer(LOYALTY_API_BEARER_TOKEN)
})