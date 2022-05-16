import { getTestHooks } from "../../support/hooks"

describe('Verify profile and global feeds post components', { tags: ['Production', 'Community'] }, () => {
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

    it('Validate customers are able to click on post content and see the expanded view', () => {
        cy.viewPost()
    })

    it('Validate customers are able to like a post and leave a comment in expanded View', () => {
        cy.likePostAndValidateCountInView()
        cy.postCommentInView('test automation comment in post view')
    })

    it('Validate customers are able to unlike a post and delete comment in expanded View', () => {
        cy.unLikePostAndValidateCountInView()
        cy.deleteCommentInView('test automation comment in post view')
    })

    it('Validate customers are able to delete their comments in expanded view', () => {
        cy.closePostView()
    })

    it('Validate customers are able to like and comment on post in feed view', () => {
        cy.likePostAndValidateCountInFeeds()
        cy.commentGlobalFeed()
        cy.postCommentInView('test automation comment in post view')
    })

    it('Validate customers are able to unlike and delete comment on post in feed view', () => {
        cy.deleteCommentInView('test automation comment in post view')
        cy.closePostView()
        cy.unLikePostAndValidateCountInFeeds()
    })
})