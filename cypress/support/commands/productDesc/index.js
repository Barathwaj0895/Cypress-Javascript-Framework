import * as productDescPage from "../../pages/productDescPage"
import * as cartPage from "../../pages/cartPage"
import * as productsPage from "../../pages/productsPage"

Cypress.Commands.add('selectVariant', (product, variant) => {
    cy.log(`select ${product} with ${variant} variant`)
    cy.url().should("include", "/products")
    productDescPage.getVariantListPDP_btn(product, variant)
        .should('be.visible')
        .trigger("click")
        .should('have.attr', 'aria-selected', 'true')
})

Cypress.Commands.add('addToBag', ({ screen = undefined, paymentMode = undefined } = {}) => {
    cy.get('body')
        .then(body => {
            if (body.find(cartPage.locatorCartClose).length) {
                return true
            }
        })
        .then(flag => {
            if (flag === true) {
                cartPage.getCartClose_btn().click()
                cy.clearCart()
            }
        })
    cy.log('Add to bag')
    cy.log(`screen : ${screen}`)
    cy.log(`Payment Mode : ${paymentMode}`)

    if (paymentMode != undefined) {
        cy.intercept(`POST`, `https://cart-api.**/carts`).as(`waitForCartApi`)
        cy.intercept('POST', 'https://play.google.com/**').as('waitForGooglePayApi')
    } else {
        cy.intercept('POST', 'https://c.**paypal.com/**').as('waitForPaypalApi')
    }

    switch (screen) {
        case 'Quickview':
            productDescPage.getAddToBag_btn('quickview').scrollIntoView().should("be.visible").trigger('click')
            break;
        case 'SetsPDP':
            productDescPage.getAddToBag_parent_btn('section').should("exist").trigger('click')
            break;
        case 'GiftCard':
            productDescPage.getGiftCardAddToBag_btn('form').should("be.visible").trigger('click')
            break;
        default:
            productDescPage.getAddToBag_btn('detail').should("be.visible").trigger('click')
    }

    switch (paymentMode) {
        case 'GooglePay':
            //wait for the Cart API
            cy.wait(`@waitForCartApi`, { timeout: 60000 })
                .then(interception => {
                    cy.wrap(interception.response.statusCode).should('be.eq', 201)
                    cy.setCookie("cartReqBody", JSON.stringify(interception.request.body))
                    cy.setCookie("cartUrl", interception.request.url)
                    cy.setCookie("cartToken", interception.request.headers.authorization)
                    cy.setCookie("cartId", interception.response.body.id)
                })
            //wait for Google pay button to be visible
            cy.wait('@waitForGooglePayApi', { timeout: 60000 })
                .its('response.statusCode')
                .should('eq', 200)
            break;
        default:
            cy.wait('@waitForPaypalApi', { timeout: 60000 })
                .its('response.statusCode')
                .should('eq', 200)
            break;
    }
    cartPage.getCardProduct_info()
        .should('be.visible')
    cy.log('Product added to cart successfully')
})

//Gift card related commands
Cypress.Commands.add('fillGiftCardDetails', (card, date) => {
    cy.log(`Select gift card amount : ${card.amount}`)
    productDescPage.getGiftCardAmount_dropDown(card.amount)
        .select(card.amount)

    cy.log(`Select gift card delivery : ${card.delivery}`)
    productDescPage.getGiftDelivery_dropDown()
        .select(card.delivery)

    cy.log(`Select gift card send date : ${date}`)
    cy.log('Click on send on textbox to open calender')
    productDescPage.getGiftCardDate_txtBox()
        .click()
        .should('have.attr', 'class')
        .and('match', /active/)

    cy.log(`Select date ${date} from calender`)
    productDescPage.getGiftCardCalDate_link(date)
        .click()

    cy.log(`Enter Recipient Name : ${card.recipientName}`)
    productDescPage.getGiftCardRecipientName_txtBox()
        .clear()
        .type(card.recipientName)
        .should('have.attr', 'value', card.recipientName)

    cy.log(`Enter Purchaser Name : ${card.purchaserName}`)
    productDescPage.getGiftCardPurchaserName_txtBox()
        .clear()
        .type(card.purchaserName)
        .should('have.attr', 'value', card.purchaserName)
    cy.log(`Enter Recipient Email : ${card.recipientEmail}`)
    productDescPage.getGiftCardRecipientEmail_txtBox()
        .clear()
        .type(card.recipientEmail)
        .should('have.attr', 'value', card.recipientEmail)

    cy.log(`Enter Gift Card Message : ${card.giftCardMessage}`)
    productDescPage.getGiftcardMessage_txtBox()
        .clear()
        .type(card.giftCardMessage)
        .should('have.text', card.giftCardMessage)

    cy.log(`Click on add to bag and verify amount on button : ${card.amount}`)
    cy.intercept('POST', 'https://c.**paypal.com/**').as('waitForPaypalApi')
    productDescPage.getGiftCardAddToBag_btn('form')
        .contains(card.amount)
        .click()
    cy.wait(`@waitForPaypalApi`, { timeout: 60000 })
        .then(interception => {
            cy.wrap(interception.response.statusCode).should('be.eq', 200)
        })
})

Cypress.Commands.add('getProductCardImagesWrapper', () => {
    cy.log('Find product Card Images')
    productDescPage.getAllProductsWithoutVarient_div()
        .first()
        .find('a')
        .then($productLink => {
            const URL = $productLink.attr('href')
            cy.wrap($productLink).click()
            cy.url().should('include', URL)
        })
})

Cypress.Commands.add('addQuantity', () => {
    cy.log('Adding Quantity')
    productDescPage.getAddQuantity_btn()
        .click()
})

Cypress.Commands.add('removeQuantity', () => {
    cy.log('Removing Quantity')
    productDescPage.removeQuantity_btn()
        .click()
})

Cypress.Commands.add('getCarousalImageNavigation', () => {
    cy.log('Finding Carousal Navigation Button')
    productDescPage.getCarousalNavigation_btn()
        .first().find('button[aria-label="Carousel image 2"]').click()
})

Cypress.Commands.add('validateCarousalImage', () => {
    productDescPage.getCarousalImage_btn()
        .should('have.attr', 'aria-selected', 'true')
})

Cypress.Commands.add('validateAddToBag_pdp', (itemName) => {
    cy.addToBag()
    cartPage.getCartObject_panel()
        .should('be.visible').and('contain', itemName)
})

Cypress.Commands.add('validatingTotalAmount', () => {
    cy.log('Validating total amount')
    productDescPage.getAddToBag_btn('detail')
        .invoke('text')
        .then(amount => {
            const price = parseInt(amount.match(/\d+/)[0])
            cy.wrap(price).should("be.greaterThan", 0)
        })
})

Cypress.Commands.add('getItemQuantity', () => {
    cy.log('Get item quantity')
    productDescPage.getQuantity_span()
        .then(quantity => {
            return cy.wrap(quantity)
        })
})

Cypress.Commands.add('selectSizeFromPlpAndClickAddToBag', (pName, size) => {
    if (size === undefined) {
        productDescPage.getPlpProduct(pName).within(() => {
            productDescPage.getGlossiWear()
                .scrollIntoView()
                .find('option')
                .each(($option, $index, $list) => {
                    const optionContent = $option.text()
                    if ((optionContent !== "" && optionContent !== undefined) && !(optionContent.includes("Out of Stock"))) {
                        productDescPage.getGlossiWear()
                            .select(optionContent)
                            .should("contain", optionContent)
                        productDescPage.getPlpAddToBag_btn().click()
                        return false
                    }
                })
        })
    } else {
        productDescPage.getPlpProduct(pName).within(() => {
            productDescPage.getGlossiWear()
                .scrollIntoView()
                .select(optionContent)
                .should("contains", optionContent)
            productDescPage.getPlpAddToBag_btn().click()
        })
    }
})

Cypress.Commands.add('validateStyledBlade', (iName) => {
    cartPage.getCartObject_panel().scrollIntoView()
        .should('be.visible').and('contain', iName)
})

Cypress.Commands.add('validateModalView', () => {
    productDescPage.getPlpmodal_view().should('be.visible')
})

Cypress.Commands.add('validateModalInnerContent', () => {
    productDescPage.getModalInnerContent_view()
        .find('#radio205').check()
})

Cypress.Commands.add('clickOnReviewButton', () => {
    cy.scrollTo('bottom')
    productDescPage.getReview_btn().should('be.visible')
        .click()
})

Cypress.Commands.add('fillReviewForm', (reviewTitle, review, rating, userName, userEmail) => {
    productDescPage.getScoreStar_btn().wait(10000).should('be.visible')
        .click()
    productDescPage.getReviewTitle_txtBox().focus()
        .type(reviewTitle)
    productDescPage.getDetailedReview_txtBox().focus()
        .type(review).type(new Date().getTime())
    productDescPage.getValueforMoney(rating).should('be.visible')
        .click()
    productDescPage.getUserName_txtBox().focus()
        .type(userName)
    productDescPage.getUserEmail_txtBox().focus()
        .type(userEmail)
})

Cypress.Commands.add('clickOnSubmitBtn', () => {
    productDescPage.getSubmit_btn().should('be.visible')
        .click()
})

Cypress.Commands.add('validateReviewCompleteBanner', () => {
    productDescPage.getReviewConfirmation_txt().should('be.visible')
})


Cypress.Commands.add('clearCart', () => {
    cy.get('body')
        .then(body => {
            if (body.find(cartPage.locatorCartClose).length) {
                return true
            }
        })
        .then(flag => {
            if (flag === true) {
                cartPage.getCartClose_btn().click()
            }
        })
    productsPage.getCart_btn()
        .click({ force: true })
    cartPage.getCartClose_btn()
        .should('be.visible')
    cy.log('Cart opened successfully')
    cy.get('body')
        .then(body => {
            if (body.find(cartPage.locatorCartEditRemove).length) {
                return true
            }
        })
        .then(flag => {
            if (flag === true) {
                cartPage.getCartEditRemove_btn()
                    .each(($btn, index, $list) => {
                        if ($btn.text() === "Remove") {
                            cy.wrap($btn)
                                .click({ force: true })
                        }

                    })
            }
        })

    cartPage.getEmptyCartMessage_label()
        .should('have.text', 'Your shopping bag is empty')
    cy.log('Cart cleared successfully')
    cartPage.getCartClose_btn()
        .should('be.visible')
        .click({ force: true })
})
