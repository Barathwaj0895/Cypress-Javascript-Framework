import { getTestHooks } from "../../support/hooks"

describe('Verify user feeds', { tags: ['Production', 'Community'] }, () => {
    getTestHooks()

    it('Login with community customer and validate customer username', () => {

        cy.fixture('communityUser.json').then(user => {
            cy.visit('/')
            cy.loginUsingApis(user)
            cy.reload()
            cy.verifyLogin()
            cy.log('Login Successfull')
            cy.window().then(win => {
                win.location.href = Cypress.config("baseUrl") + '/community/feed'
            })
            cy.verifyUrl('/community/feed')
            cy.verifyUsername(user)
        })
    })

    it('Validate customer is able to see global feeds and perform infinite scrolling', () => {
       cy.infiniteScrollingFeeds()
    })

    it('Validate customer is able to jump to top by clicking on jump to top button', () => {
        cy.verifyScrollToTop()
    })
})
