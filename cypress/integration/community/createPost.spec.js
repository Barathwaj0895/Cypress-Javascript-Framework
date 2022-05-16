import { getTestHooks } from "../../support/hooks"

describe('Verify create post', { tags: ['Production', 'Community'] }, () => {
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

    it('Validate customers are able to click the Create post button and the post blade opens', () => {
        cy.createPost()
    })

    it('Validate customers are able to upload an image to their post', () => {
        let images = ['post pic 1.png']
        cy.uploadImages(...images)
    })

    it('Validate customers are able to create a post', () => {
        cy.postCreatedPost()
    })

    it('Validate created post is loaded immediately at top of feed', () => {
        cy.fixture("communityUser.json").then(user => {
            cy.verifyPost(user)
            cy.deleteLatestPost()
        })
    })

    it('Validate customers are able to create post with uploading 3 images to their post', () => {
        cy.createPost()
        let images = ['post pic 1.png', 'post pic 2.png', 'post pic 3.png']
        cy.uploadImages(...images)
        cy.postCreatedPost()
        cy.fixture("communityUser.json").then(user => {
            cy.verifyPost(user)
            cy.deleteLatestPost()
        })
    })

    it('Validate customers are able to create post with less than 15 MB image to their post', () => {
        cy.createPost()
        let images = ['post pic less than 15 MB.png']
        cy.uploadImages(...images)
        cy.postCreatedPost()
        cy.fixture("communityUser.json").then(user => {
            cy.verifyPost(user)
            cy.deleteLatestPost()
        })
    })
})