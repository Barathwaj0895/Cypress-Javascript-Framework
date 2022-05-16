import { getTestHooks } from "../../support/hooks"

let sampleCartRequest = require("../../fixtures/sampleCartRequest.json")

describe('Checkout a product at retail POS', { tags: ['Retail', 'Production'] }, () => {
    getTestHooks()

    let PRODUCTION_BASE_URL = Cypress.env('PRODUCTION_BASE_URL')
    let PRODUCTION_CART_SERVICE_BASE_URL = Cypress.env('PRODUCTION_CART_SERVICE_BASE_URL')
    let AUTHORIZATION_TOKEN = Cypress.env('AUTHORIZATION_TOKEN')
    let WAF_CHECK = Cypress.env('WAF_CHECK')
    let EDITOR_PIN = Cypress.env('EDITOR_PIN')
    let LOCATION = "SEA1"
    let US_STRIPE_TEST_API_KEY = Cypress.env('US_STRIPE_TEST_API_KEY')

    it('Create session', () => {
        cy.request({
            method: 'POST', url: PRODUCTION_BASE_URL + 'sessions',
            headers: {
                'authorization': AUTHORIZATION_TOKEN,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'WafCheck': WAF_CHECK
            },
            body: { "data": { "attributes": { "pin": EDITOR_PIN }, "type": "editor" } }
        }).then(response => {
            if (response.status === 200) {
                cy.log(`response : ${JSON.stringify(response.body)}`)
                cy.setCookie("EDITOR_JWT", response.body.editor.apiToken)
            }

        })
    })

    it('Create cart auth token', () => {
        cy.getCookie("EDITOR_JWT").then(editorJWT => {
            cy.request({
                method: 'POST', url: PRODUCTION_BASE_URL + 'cart_auth_tokens',
                headers: {
                    'authorization': AUTHORIZATION_TOKEN,
                    'retail-editor-token': editorJWT.value,
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'WafCheck': WAF_CHECK
                },
                body: { "data": { "type": "cart_auth_token", "attributes": { "anonid": null, "userid": null } } }
            }).then(response => {
                cy.wrap(response.status).should("equal", 200)
                cy.setCookie("cart_auth_token", response.body.cart_auth_token)
            })
        })
    })

    it('Verify product stock available', () => {
        cy.request({
            method: 'GET', url: PRODUCTION_BASE_URL + 'products',
            headers: {
                'authorization': AUTHORIZATION_TOKEN,
                'location-id': LOCATION,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'WafCheck': WAF_CHECK
            },
        }).then(getProductsResponse => {
            cy.log(`get products response :  ${JSON.stringify(getProductsResponse.body)}`)
            cy.wrap(getProductsResponse.status).should("equal", 200)
            let id = getProductsResponse.body.data[0].relationships.variants.data[0].id
            let type = getProductsResponse.body.data[0].relationships.variants.data[0].type
            let filteredData = getProductsResponse.body.included.filter(entry => {
                return entry.id === id && entry.type === type;
            });
            cy.log("filtered data : " + JSON.stringify(filteredData))
            const skuName = filteredData[0].attributes.sku
            cy.request({
                method: 'GET', url: PRODUCTION_BASE_URL + 'stocks?skus%5B%5D=' + skuName,
                headers: {
                    'authorization': AUTHORIZATION_TOKEN,
                    'location-id': LOCATION,
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'WafCheck': WAF_CHECK
                },
            }).then(getStockResponse => {
                cy.log(`get products response :  ${JSON.stringify(getStockResponse.body)}`)
                cy.wrap(getStockResponse.status).should("equal", 200)
                cy.wrap(getStockResponse.body[skuName]).should("be.gt", 0)

                sampleCartRequest.items = [{
                    "images": {
                        "thumbnail": {
                            "alt": null,
                            "description": null,
                            "uiHook": "thumbnail",
                            "urlTemplate": "https://static-assets.glossier.com" + getProductsResponse.body.data[0].attributes.thumbnail
                        }
                    },
                    "quantity": 1,
                    "productId": getProductsResponse.body.data[0].id,
                    "taxCode": filteredData[0].attributes.tax_code,
                    "uuid": "e6a8814a-98dc-4622-a3ef-6f7f33acbca1",
                    "productCategory": getProductsResponse.body.data[0].product_category,
                    "total": filteredData[0].attributes.price,
                    "name": getProductsResponse.body.data[0].attributes.name,
                    "id": filteredData[0].id,
                    "sku": filteredData[0].attributes.sku,
                    "slug": getProductsResponse.body.data[0].attributes.slug,
                    "option": {
                        "presentation": null,
                        "cssColor": null
                    }
                }]
            })
        })
    })

    it('Create cart and add product', () => {
        cy.getCookie('cart_auth_token').then(cart_auth_token => {
            cy.getCookie("EDITOR_JWT").then(editorJWT => {
                cy.fixture('user.json').then(user => {
                    cy.request({
                        method: 'GET', url: PRODUCTION_BASE_URL + 'customers?email=' + user.email,
                        headers: {
                            'authorization': AUTHORIZATION_TOKEN,
                            'location-id': LOCATION,
                            'Accept': 'application/vnd.api+json',
                            'Content-Type': 'application/vnd.api+json',
                            'WafCheck': WAF_CHECK,
                            'retail-editor-token': editorJWT.value,
                        },
                    }).then(getCustomerResponse => {
                        cy.log(`get customer response :  ${JSON.stringify(getCustomerResponse.body)}`)
                        cy.wrap(getCustomerResponse.status).should("equal", 200)
                        cy.wrap(getCustomerResponse.body).as("getCustomerResponse")
                    })
                    cy.request({
                        method: `POST`, url: PRODUCTION_CART_SERVICE_BASE_URL + "/carts", timeout: 60000,
                        headers: {
                            'authorization': "Basic " + cart_auth_token.value,
                            'retail-editor-token': editorJWT.value,
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: { "currency": "USD", "country": "US" }
                    }).then(emptyCartResponse => {
                        cy.log(`empty cart response :  ${JSON.stringify(emptyCartResponse.body)}`)
                        cy.wrap(emptyCartResponse.status).should("equal", 201)
                        cy.wrap(emptyCartResponse.body).as("emptyCartResponse")
                    })
                })
            })
        })

        cy.getCookie('cart_auth_token').then(cart_auth_token => {
            cy.get("@getCustomerResponse").then(getCustomerResponse => {
                cy.get("@emptyCartResponse").then(emptyCartResponse => {
                    sampleCartRequest.account.hasCompletedOrders = true
                    sampleCartRequest.account.userId = getCustomerResponse.id
                    sampleCartRequest.account.email = getCustomerResponse.email
                    sampleCartRequest.account.anonId = emptyCartResponse.account.anonId
                    sampleCartRequest.id = emptyCartResponse.id
                    sampleCartRequest.source = PRODUCTION_BASE_URL

                    const d = new Date();
                    let time = d.getTime();
                    sampleCartRequest.timestamps.createdAt = time
                    sampleCartRequest.timestamps.updatedAt = time
                    sampleCartRequest.expireOn = time + 12000000000

                    cy.request({
                        method: `POST`, url: PRODUCTION_CART_SERVICE_BASE_URL + '/carts', timeout: 60000,
                        headers: {
                            'authorization': "Basic " + cart_auth_token.value,
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: sampleCartRequest
                    }).then(cartApplyResponse => {
                        cy.log(`cart response :  ${JSON.stringify(cartApplyResponse.body)}`)
                        cy.wrap(cartApplyResponse.status).should("equal", 200)
                    })
                    cy.request({
                        method: `POST`, url: PRODUCTION_CART_SERVICE_BASE_URL + '/taxes', timeout: 60000,
                        headers: {
                            'authorization': "Basic " + cart_auth_token.value,
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: sampleCartRequest
                    }).then(taxesResponse => {
                        cy.log(`taxes response :  ${JSON.stringify(taxesResponse.body)}`)
                        cy.wrap(taxesResponse.status).should("equal", 200)
                        sampleCartRequest.totals = taxesResponse.body.totals
                    })
                    cy.request({
                        method: `POST`, url: 'https://skgwl1nqcc.execute-api.us-east-1.amazonaws.com/prod/apply', timeout: 60000,
                        headers: {
                            'authorization': "Basic " + cart_auth_token.value,
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: sampleCartRequest
                    }).then(applyResponse => {
                        cy.log(`apply response :  ${JSON.stringify(applyResponse.body)}`)
                        cy.wrap(applyResponse.status).should("equal", 200)
                    })
                })
            })
        })
    })

    it('Complete the payment', () => {
        //data to generate a stripe token
        let formData = new URLSearchParams()
        cy.fixture('creditCards.json').then(card => {
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
            formData.append('email', sampleCartRequest.account.email)

            cy.request({
                method: `POST`, url: 'https://api.stripe.com/v1/tokens', body: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorization': 'Bearer ' + US_STRIPE_TEST_API_KEY
                }
            }).then(response => {
                cy.log(`Stripe token response :  ${JSON.stringify(response.body)}`)
                cy.wrap(response.body.id).as('stripeToken')
            })
        })

        cy.get('@stripeToken').then(stripeToken => {
            cy.getCookie('cart_auth_token').then(cart_auth_token => {
                sampleCartRequest.payment.token = stripeToken
                sampleCartRequest.testMode = true

                //Call the cart API to complete order
                let CompleteCartUrl = PRODUCTION_CART_SERVICE_BASE_URL + '/carts/' + sampleCartRequest.id + '/complete'
                cy.request({
                    method: `POST`, url: CompleteCartUrl, body: sampleCartRequest,
                    headers: {
                        'authorization': 'Bearer ' + cart_auth_token.value,
                        'Content-Type': 'application/json'
                    }
                }).then(completeResponse => {
                    if (completeResponse.status === 200) {
                        cy.log(`Order Completion ID :  ${JSON.stringify(completeResponse.body)}`)
                        cy.once('test:after:run', (test) => addContext({ test }, completeResponse.body))
                    } else {
                        cy.log('order failed')
                    }
                })
            })
        })
    })
})