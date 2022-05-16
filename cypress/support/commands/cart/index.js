import * as cartPage from '../../pages/cartPage'


Cypress.Commands.add('continueToCheckout', () => {
    cy.intercept(`POST`, `https://**/carts`).as(`waitForCartApi`)
    cy.log('Click on continue to checkout')
    cartPage.getContinueToCheckout_btn()
        .should('be.visible')
        .click()
    cy.wait('@waitForCartApi', { timeout: 60000 }).then(interception => {
        cy.wrap(interception.response.statusCode).should('be.eq', 200)
    })
})

Cypress.Commands.add('waitForPayPalButton', () => {
    cy.log('wait for the Paypal button to be visible, aws api will also get loaded in that time')
    /*
    We were seeing an issue that aws cognito apis were not getting loaded in a short time frame.
    So we are waiting till that button get loaded else we will get redirected to '/product' page.
    */
    cartPage.getPaypal_btn()
        .should('be.visible')
})

Cypress.Commands.add('verifyProductTitleInCart', (prodTitle) => {
    cy.log('Verify that cart is opened')
    cartPage.getCartObject_panel()
        .should('be.visible')
    cartPage.getCardProduct_info()
        .should('be.visible')
        .and('contain', prodTitle)
})

Cypress.Commands.add('closeCartButton', () => {
    cartPage.getCartClose_btn().should('be.visible').click()
})

Cypress.Commands.add('clickOnGooglePayButton', () => {
    cartPage.getGooglePay_btn().should('be.visible').click()
})

Cypress.Commands.add('checkoutUsingGooglePay', () => {
    cy.fixture('sampleCartRequest.json').as("sampleCartRequest")
    cy.fixture('creditCards.json').as("creditCards")
    cy.fixture('user.json').as('user')

    cy.get('@sampleCartRequest').then((sampleCartRequest) => {
        cy.get('@creditCards').then((card) => {
            cy.get('@user').then((user) => {
                cy.getCookies().then(cookies => {
                    //getCookies data
                    let cartReqBody = JSON.parse(cookies.find(cookie => cookie.name === 'cartReqBody').value)
                    let cartUrl = cookies.find(cookie => cookie.name === 'cartUrl').value
                    let cartToken = cookies.find(cookie => cookie.name === 'cartToken').value
                    let cartId = cookies.find(cookie => cookie.name === 'cartId').value

                    //set request data
                    cartReqBody.address = sampleCartRequest.address
                    cartReqBody.storedPaymentMethod = sampleCartRequest.storedPaymentMethod
                    cartReqBody.id = cartId

                    //send a taxes request
                    cy.request({
                        method: `POST`, url: cartUrl.replace('/carts', '/taxes'), body: cartReqBody,
                        headers: {
                            'authorization': cartToken,
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        cy.log(`cart taxes response :  ${JSON.stringify(response.body)}`)
                        cartReqBody.totals = response.body.totals
                        cartReqBody.taxes = response.body.taxes
                    })

                    //data to generate a stripe token
                    let formData = new URLSearchParams()
                    formData.append('card[name]', sampleCartRequest.address.firstname)
                    formData.append('card[address_line1]', sampleCartRequest.address.address1)
                    formData.append('card[address_line2]', sampleCartRequest.address.address2)
                    formData.append('card[address_city]', sampleCartRequest.address.city)
                    formData.append('card[address_state]', 'NY')
                    formData.append('card[address_zip]', sampleCartRequest.address.zipcode)
                    formData.append('card[address_country]', sampleCartRequest.country)
                    formData.append('card[number]', card.passing.number)
                    formData.append('card[cvc]', card.passing.cvc)
                    formData.append('card[exp_year]', card.passing.expiryDate.substring(2, 4))
                    formData.append('card[exp_month]', card.passing.expiryDate.substring(0, 2))
                    formData.append('email', user.email)

                    cy.request({
                        method: `POST`, url: 'https://api.stripe.com/v1/tokens', body: formData.toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'authorization': Cypress.env('stripeBearerToken')
                        }
                    }).then(response => {
                        cy.log(`Stripe token response :  ${JSON.stringify(response.body)}`)
                        cy.wrap(response.body.id).as('stripeToken')
                    })


                    cartReqBody.shipping = sampleCartRequest.shipping
                    cartReqBody.payment = sampleCartRequest.payment
                    cy.get('@stripeToken').then(stripeToken => {
                        cartReqBody.payment.token = stripeToken
                        cartReqBody.testMode = true
                        cartReqBody.account.email = user.email
                        cartReqBody.hasCompletedOrders = sampleCartRequest.account.hasCompletedOrders
                        cartReqBody.subscribed = sampleCartRequest.account.subscribed
                        cartReqBody.outOfStock = sampleCartRequest.account.outOfStock

                        //Call the cart API to complete order
                        let CompleteCartUrl = cartUrl + '/' + cartId + '/complete'
                        cy.request({
                            method: `POST`, url: CompleteCartUrl, body: cartReqBody,
                            headers: {
                                'authorization': cartToken,
                                'Content-Type': 'application/json'
                            }
                        }).then(response => {
                            if (response.status === 200) {
                                cy.log(`Order Completion ID :  ${JSON.stringify(response.body)}`)
                                cy.once('test:after:run', (test) => addContext({ test }, response.body))
                                //GET the order placed details
                                cy.request({
                                    method: `GET`, url: cartUrl + '/' + cartId,
                                    headers: {
                                        'authorization': cartToken,
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then(response => {
                                        if (response.status === 200) {
                                            cy.visit(`/checkout/summary/${cartId}`)
                                        } else {
                                            cy.log('Order failed')
                                        }
                                    })
                            } else {
                                cy.log('order failed')
                            }
                        })
                    })
                })
            })
        })
    })
})

Cypress.Commands.add('selectPayWithPointsForRedeemFlow', (spendablePoints) => {
    cartPage.payWithPointsInCartPage_label().should('be.visible')
        .click()
    cartPage.getRedeemPoints_list().select(spendablePoints)
    cartPage.getApplytoBag_btn().should('be.visible')
        .click()
    cy.wait(5000)
})

Cypress.Commands.add('validatePayWithPointsAmountIsAppliedInTotalBill', () => {
    cartPage.getProductAmount_txt('Digital Gift Card').then(price => {
        cy.wrap(price).as('giftCardAmount')
    })
    cartPage.getShippingAmount_txt().then(shipping => {
        cy.wrap(shipping).as('shippingCharges')
    })
    cartPage.getSubTotal_txt().then((subtotal) => {
        cy.get('@giftCardAmount').then(cardAmount => {
            cy.get('@shippingCharges').then(shipping => {
                let giftCardAmount = 0.0
                if (cardAmount !== undefined) {
                    giftCardAmount = parseFloat(cardAmount.replace("$", "").trim())
                }
                let shippingAmount = 0.0
                if (shipping !== "Free" && shipping !== "--") {
                    shippingAmount = parseFloat(shipping.replace("$", "").trim())
                }
                let subTotalAmount = parseFloat(subtotal.replace("$", "").trim())
                cy.log("Subtotal is: " + subTotalAmount)
                cartPage.getGlossierRewardCash_txt().then((rewards) => {
                    let rewardPoints = parseFloat(rewards.replace("-$", "").trim())
                    cy.log("Glossier Reward Points: ", +rewardPoints)
                    cartPage.getTaxAmount_txt().then((tax) => {
                        let taxAmount = 0.0
                        if (tax !== "--") {
                            taxAmount = parseFloat(tax.replace("$", "").trim())
                        }
                        cy.log("Tax: " + taxAmount)
                        cartPage.getEstimatedAmount_txt().then((estimatedAmount) => {
                            let expectedAmount = parseFloat(estimatedAmount.replace("$", "").trim())
                            cy.log("Estimated Amount: " + expectedAmount)
                            let actualAmount = subTotalAmount + taxAmount + shippingAmount - rewardPoints
                            cy.log("Actual Amount: " + actualAmount)
                            expect(expectedAmount - giftCardAmount).equal(actualAmount - giftCardAmount)
                        })
                    })
                })
            })
        })
    });
})

Cypress.Commands.add('validatePointsCanNotBeAvailedMoreThanProductWorth', () => {
    //There is a bug right now, points applied are not being reset if we remove the product.
    cartPage.getRedeemPoints_list().invoke('attr', 'disabled').then(flag => {
        if (flag !== undefined) {
            cartPage.getRemoveRedeemPoints_btn()
                .should("be.visible")
                .click()
        }
    })

    cartPage.getSubTotal_txt().then((subtotal) => {
        let subTotalAmount = parseFloat(subtotal.replace("$", "").trim())
        cy.log("Subtotal is: " + subTotalAmount)
        if (subTotalAmount < 20) {
            let points = (parseInt(subTotalAmount / 5) + 1) * 5
            let selectPoints = ""
            cy.log(`points : ${points}`)
            switch (points) {
                case 5: selectPoints = `$${points} (100 points)`
                    break;
                case 10: selectPoints = `$${points} (200 points)`
                    break;
                case 15: selectPoints = `$${points} (300 points)`
                    break;
                case 20: selectPoints = `$${points} (400 points)`
                    break;
            }
            cartPage.payWithPointsInCartPage_label().should('be.visible')
                .click()
            cartPage.getRedeemPoints_list().select(selectPoints)
            cartPage.getApplytoBag_btn().should('be.visible')
                .click()
            cy.wait(5000)
            //Need to be coded - validate the error message
            cartPage.getRemoveRedeemPoints_btn()
                .should("be.visible")
                .click()
        }
    })
})
Cypress.Commands.add('verifyPayWithPointsBannerAvailableFor0to99Points', (text, points) => {
    cartPage.payWithPointsInCartPage_label().should('be.visible')
        .click()
    cartPage.getPayWithPointsIndicator_txt(text).should('be.visible')
    cartPage.getHowManyPointsAvailable_txt(points).should('be.visible')
    cartPage.getProgressBarLevel_txt(points).should('be.visible')
})

Cypress.Commands.add('validatePayWithPointsIsSeenAccordingToTheUserTier', (points) => {
    cartPage.payWithPointsInCartPage_label().should('be.visible')
        .click()
    cartPage.getListOfOptions_txt().then(options => {
        const actual = [...options].map(o => o.text)
        cy.log(actual)
    });
    cartPage.getHowManyPointsAvailable_txt(points).then(spendablePoints => {
        if (spendablePoints >= 100 && spendablePoints < 200) {
            actual.equal("$5 (100 points)")
        } else if (spendablePoints >= 200 && spendablePoints < 300) {
            actual.equal("$5 (100 points)", "$10 (200 points)", "$10 (200 points)")
        } else if (spendablePoints >= 300 && spendablePoints < 400) {
            actual.equal("$5 (100 points)", "$10 (200 points)", "$10 (200 points)", "$15 (300 points)")
        } else if (spendablePoints >= 400) {
            actual.equal("$5 (100 points)", "$10 (200 points)", "$10 (200 points)", "$15 (300 points)", "$20 (400 points)")
        }
    });
    cy.wait(5000)
})

Cypress.Commands.add('validateTotalOrderAmountShouldNotBeZero', (amount) => {
    cartPage.getTotalOrderAmount_txt().should('not.contain.text', amount)
    cartPage.getTotalOrderAmount_txt().should('not.contain.text', "Free")
})
