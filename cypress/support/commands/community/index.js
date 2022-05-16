import * as communityPage from '../../pages/communityPage'

Cypress.Commands.add('verifyUsername', (user) => {
    cy.log("verifying community page is opened")
    communityPage.getUsername_label()
        .should("be.visible")
        .should("have.text", user.username)
})

Cypress.Commands.add('verifyFeedsAvailable', () => {
    cy.log("verifying atleast one post is available")
    communityPage.getPostCard_panel()
        .should("have.length.at.least", 1)
})

Cypress.Commands.add('verifyScrollToTop', () => {
    cy.log("verifying scroll to top button is working")
    communityPage.getJumpToTop_btn()
        .should("be.visible")
        .click()
    communityPage.getCreatePost_btn()
        .should("have.visible")
})
let counter = 0
Cypress.Commands.add('infiniteScrollingFeeds', () => {
    cy.get('body')
        .then(body => {
            if (body.find(communityPage.getFeedEnds_div).length) {
                cy.get('body').find(communityPage.getFeedEnds_div).should("have.text", "You're all caught up!")
                return
            } else {
                cy.log("waiting")
                cy.wait(3000)
                cy.scrollTo('bottom')
                counter = counter + 1
                if(counter <= 20){
                    cy.infiniteScrollingFeeds()
                } 
            }
        })
})

Cypress.Commands.add('createPost', () => {
    cy.log("verifying user able to click on create post the post panel opens")
    communityPage.getCreatePost_btn()
        .should("have.visible")
        .click()
    communityPage.getPostThePost_btn()
        .should("be.visible")
    cy.log('post blade is opened')
})

Cypress.Commands.add('uploadImages', (...images) => {
    cy.log("verifying user able to upload images")
    cy.intercept(`GET`, `**assetUploadURL?batchSize=1&assetType=photo`).as(`waitForAssetUploadURL`)
    cy.intercept(`POST`, `https://s3.amazonaws.com/glossier-community-assets-main`).as(`waitForAssetsMain`)
    images.forEach(image => {
        communityPage.getAddPhoto_btn()
            .should("have.visible")
            .click()
        communityPage.getUploadFile_btn()
            .click()
            .attachFile({ filePath: `images/${image}` })
        communityPage.getUploadedImage_img()
            .should("exist")
        communityPage.getSavePhoto_btn()
            .wait(2000)
            .should("be.visible")
            .click()
        cy.wait('@waitForAssetUploadURL', { timeout: 60000 })
            .its('response.statusCode')
            .should('eq', 200)
        cy.wait('@waitForAssetsMain', { timeout: 60000 })
            .its('response.statusCode')
            .should('eq', 204)
        communityPage.getImageUploaded_img()
            .should("have.length.greaterThan", 0)
        cy.log('Image uploaded sucessfully')
    });
    communityPage.getPostTitle_textarea()
        .scrollIntoView()
        .should("be.visible")
        .type("test automation post")
})

Cypress.Commands.add('postCreatedPost', () => {
    cy.log("verifying user able to click on post the created post")
    cy.intercept(`POST`, `https://brunch-api.glossier.com/**/posts`).as(`waitForPostSubmission`)
    communityPage.getPostThePost_btn()
        .should("have.visible")
        .click()
    cy.wait('@waitForPostSubmission', { timeout: 60000 })
        .its('response.statusCode')
        .should('eq', 200)
})

Cypress.Commands.add('verifyPost', (user) => {
    communityPage.getProfileInfoCard_div()
        .find('a')
        .first()
        .invoke('attr', 'href')
        .should("equal", "/community/profile/" + user.username)
    communityPage.getlatestPostTime_span()
        .first()
        .invoke('text')
        .should("match", /sec. ago/)
})

Cypress.Commands.add('deleteLatestPost', () => {
    cy.intercept(`DELETE`, `https://brunch-api.glossier.com/**/posts/*`).as(`waitForPostDelete`)
    communityPage.getDeletePost_btn()
        .should("have.length.at.least", 1)
        .first()
        .click()
    communityPage.getDeletePostDialog_div()
        .find('button')
        .contains('Delete Post')
        .first()
        .should('be.visible')
        .click({ force: true })
    cy.wait('@waitForPostDelete', { timeout: 60000 })
        .its('response.statusCode')
        .should('eq', 200)
})

Cypress.Commands.add('viewPost', () => {
    communityPage.getPostTextContent_h5()
        .should('have.length.at.least', 1)
        .first()
        .click()
})

Cypress.Commands.add('likePostAndValidateCountInView', () => {
    communityPage.getModelViewContainer_div()
        .should('be.visible')
        .find(communityPage.getLike_btn_locator)
        .last()
        .find('div > p')
        .then(countEle => {
            cy.wrap(parseInt(countEle.text())).as('likeCountBefore')
        })

    communityPage.getModelViewContainer_div()
        .should('be.visible')
        .find(communityPage.getLike_btn_locator)
        .last()
        .trigger('click')

    communityPage.getModelViewContainer_div()
        .should('be.visible')
        .find(communityPage.getUnLike_btn_locator)
        .last()
        .find('div > p')
        .then(countEle => {
            cy.get('@likeCountBefore').should('be.eq', parseInt(countEle.text()) - 1)
        })
})

Cypress.Commands.add('unLikePostAndValidateCountInView', () => {
    communityPage.getModelViewContainer_div()
        .should('be.visible')
        .find(communityPage.getUnLike_btn_locator)
        .last()
        .find('div > p')
        .then(countEle => {
            cy.wrap(parseInt(countEle.text())).as('likeCountBefore')
        })

    communityPage.getModelViewContainer_div()
        .should('be.visible')
        .find(communityPage.getUnLike_btn_locator)
        .last()
        .trigger('click')

    communityPage.getModelViewContainer_div()
        .should('be.visible')
        .find(communityPage.getLike_btn_locator)
        .last()
        .find('div > p')
        .then(countEle => {
            cy.get('@likeCountBefore').should('be.eq', parseInt(countEle.text()) + 1)
        })
})

Cypress.Commands.add('postCommentInView', (message) => {
    cy.intercept(`POST`, `https://brunch-api.glossier.com/*/posts/*/comments`).as(`waitForCommentResponse`)
    communityPage.getCommentInView_textarea()
        .should("be.visible")
        .click()
        .type(message)
    communityPage.getPostCommentInView_btn()
        .should('be.visible')
        .click({ delay: 1000 })
    cy.wait('@waitForCommentResponse', { timeout: 60000 })
        .its('response.statusCode')
        .should('eq', 200)
})

Cypress.Commands.add('deleteCommentInView', () => {
    cy.intercept(`DELETE`, `https://brunch-api.glossier.com/*/posts/*/comments/*`).as(`waitForCommentDeleteResponse`)
    communityPage.getPostCommentContainer_div()
        .should('be.visible')
        .find('button')
        .wait(2000)
        .contains('Delete')
        .first()
        .click({ force: true })
    communityPage.getDeleteComment_header()
        .should("be.visible")
        .siblings('div')
        .find('button')
        .contains('Delete Comment')
        .click()
    cy.wait('@waitForCommentDeleteResponse', { timeout: 60000 })
        .its('response.statusCode')
        .should('eq', 200)
})

Cypress.Commands.add('closePostView', () => {
    communityPage.getClosePostView_btn()
        .first()
        .scrollIntoView()
        .click({ force: true })
})

Cypress.Commands.add('likePostAndValidateCountInFeeds', () => {
    communityPage.getLikeUnlike_btn('like')
        .should('be.visible')
        .first()
        .find('div > p')
        .then(countEle => {
            cy.wrap(parseInt(countEle.text())).as('likeCountBefore')
        })

    communityPage.getLikeUnlike_btn('like')
        .should('be.visible')
        .first()
        .click()
        .invoke('attr', 'aria-label')
        .should("eq", "unlike")

    communityPage.getLikeUnlike_btn('unlike')
        .should('be.visible')
        .first()
        .find('div > p')
        .then(countEle => {
            cy.get('@likeCountBefore').should('be.eq', parseInt(countEle.text()) - 1)
        })
})

Cypress.Commands.add('unLikePostAndValidateCountInFeeds', () => {
    communityPage.getLikeUnlike_btn('unlike')
        .should('be.visible')
        .first()
        .find('div > p')
        .then(countEle => {
            cy.wrap(parseInt(countEle.text())).as('likeCountBefore')
        })

    communityPage.getLikeUnlike_btn('unlike')
        .should('be.visible')
        .first()
        .click()
        .invoke('attr', 'aria-label')
        .should("eq", "like")

    communityPage.getLikeUnlike_btn('like')
        .should('be.visible')
        .first()
        .find('div > p')
        .then(countEle => {
            cy.get('@likeCountBefore').should('be.eq', parseInt(countEle.text()) + 1)
        })
})

Cypress.Commands.add('commentGlobalFeed', () => {
    communityPage.getLikeUnlike_btn('unlike')
        .should('be.visible')
        .first()
        .parent('div')
        .siblings(communityPage.getGloblFeedComment_btn_locator)
        .should("be.visible")
        .click()
    communityPage.getModelViewContainer_div()
        .should('be.visible')
})
