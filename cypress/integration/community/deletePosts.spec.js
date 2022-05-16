import { getTestHooks } from "../../support/hooks"

describe('Verify delete post', { tags: ['Production', 'Community'] }, () => {
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

    it('Validate customers are able to create post with image to their post', () => {
        cy.createPost()
        let images = ['post pic 3.png']
        cy.uploadImages(...images)
        cy.postCreatedPost()
        cy.fixture("communityUser.json").then(user => {
            cy.verifyPost(user)
        })
    })

    it('Validate customers are able to delete their post', () => {
        cy.deleteLatestPost()
    })
})