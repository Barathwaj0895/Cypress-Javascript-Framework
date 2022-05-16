import * as checkoutPage from "../../pages/checkoutPage"

Cypress.Commands.add('fillCheckoutFormEmail', () => {
  checkoutPage.getCheckoutEmail_txtBox()
    .should("be.visible")
    .wait(2000)
    .focus()
    .invoke('val', 'automatedordertest@glossier.com')
})

Cypress.Commands.add('fillCheckoutFormAddress', address => {
  checkoutPage.getFirstName_TxtBox()
    .should('be.visible')
    .type(address.firstName)
  checkoutPage.getLastName_txtBox()
    .type(address.lastName)
  checkoutPage.getAddress_txtBox()
    .type(address.address1)
  checkoutPage.getZIPCode_txtBox()
    .type(address.zipCode)
  checkoutPage.getCity_txtBox()
    .type(address.city)
  checkoutPage.getCountry_txtBox()
    .should("be.visible")
    .invoke("val")
    .then(val => {
      if (val.includes('United States')) {
        checkoutPage.getState_txtBox()
          .select(address.state)
      } else {
        checkoutPage.getState_txtBox()
          .type(address.state)
      }
    })
  checkoutPage.getPhone_txtBox()
    .type(address.phone)
})

Cypress.Commands.add('fillCheckoutFormPayment', card => {
  cy.get('.__PrivateStripeElement > iframe')
    .iframe()
    .should("be.visible")
    .within($iframe => {
      checkoutPage.getCardNumber_txtBox()
        .should("be.visible")
        .focus()
        .type(card.number)

      checkoutPage.getExpDate_txtBox()
        .should("be.visible")
        .focus()
        .type(card.expiryDate)

      checkoutPage.getCvc_txtBox()
        .should("be.visible")
        .focus()
        .type(card.cvc)

      cy.wrap($iframe).then(() => {
        if ($iframe.find('input[name="postal"]').length) {
          checkoutPage.getPostal_txtBox()
            .should("be.visible")
            .focus()
            .type(card.zipCode)
        }
      })
    })
})

Cypress.Commands.add('clickCheckoutFormConfirm', () => {
  checkoutPage.getPlaceOrder_btn().click()
  checkoutPage.getOrderSummary_panel().should('be.visible')
})

Cypress.Commands.add('verifyShippingMessage', () => {
  cy.log('Verifying shipping message')
  checkoutPage.getShippingMessage_label()
    .should('be.visible')
    .invoke('text')
    .then(text => {
      cy.log(text)
      if (text === "Shipping") {
        cy.get('body')
          .then(body => {
            if (body.find(checkoutPage.locatorEditShipping_btn).length) {
              return true
            }
          })
          .then(flag => {
            if (flag === true) {
              checkoutPage.getCheckoutEdit_btn("Edit Shipping").click()
            }
          })
      }
    })
  checkoutPage.getShippingMessage_label().should('have.text', 'Where’s this order going?')
})

Cypress.Commands.add('selectExistSelectedAdd', () => {
  cy.log('select existing address')
  checkoutPage.getSelExistDlvryAdd_radioBtn()
    .should('exist')
    .first()
    .click()
    .should('have.attr', 'aria-checked', 'true')
})

Cypress.Commands.add('clickOnNextOnAddBook', () => {
  cy.intercept(`POST`, `https://**/+(carts|apply)`).as(`waitForCartApi`)
  cy.log('Click on next on address book')
  checkoutPage.getAddressFooter_btn().contains('Next')
    .first()
    .should('be.visible')
    .click({ force: true })
  cy.wait('@waitForCartApi', { timeout: 60000 }).then(interception => {
    cy.wrap(interception.response.statusCode).should('be.eq', 200)
  })
})

Cypress.Commands.add('verifyDeliveryMessage', () => {
  cy.log('Verifying delivery message')
  checkoutPage.getDeliveryMessage_label()
    .should('be.visible')
    .invoke('text')
    .then(text => {
      cy.log(text)
      if (text === "Delivery") {
        cy.get('body')
          .then(body => {
            if (body.find(checkoutPage.locatorEditDelivery_btn).length) {
              return true
            }
          })
          .then(flag => {
            if (flag === true) {
              checkoutPage.getCheckoutEdit_btn("Edit Delivery").click()
            }
          })
      }
    })
  checkoutPage.getDeliveryMessage_label().should('have.text', 'How do you want your order delivered?')
})

Cypress.Commands.add("selectShippingOption", (option) => {
  cy.log(`Select Shipping Option : ${option}`);
  const standardRegex = new RegExp(/Standard \(\d+-\d+ business days\)/gi);
  const rushRegex = new RegExp(/Rush \(\d+-\d+ business days\)/gi);
  if (standardRegex.test(option)) {
    option = standardRegex
  } else if (rushRegex.test(option)) {
    option = rushRegex
  }
  cy.log("option regex : " + option)
  checkoutPage.selectShippingOptions()
    .contains(option)
    .should('be.visible')
    .click()
    .children('input')
    .should('have.attr', 'aria-checked', 'true')
})

Cypress.Commands.add("validateShippingOption", (assertionKey, shippingOption) => {
  cy.log(`ValidateShippingOption : ${assertionKey} : ${shippingOption}`);
  checkoutPage.selectShippingOptions()
    .should(assertionKey, shippingOption)
})

Cypress.Commands.add('clickOnNextOnDeliveryMethod', () => {
  cy.intercept(`POST`, `https://**/+(carts|apply)`).as(`waitForCartApi`)
  cy.log('Click on next on delivery method')
  checkoutPage.getNextDelMethod_btn()
    .first()
    .should('be.visible')
    .should("have.text", "Next")
    .click({ force: true })
  cy.wait('@waitForCartApi', { timeout: 60000 }).then(interception => {
    cy.wrap(interception.response.statusCode).should('be.eq', 200)
  })
})

Cypress.Commands.add('verifyPaymentMessage', () => {
  cy.log('verifying payment message')
  checkoutPage.getPaymentMessage_label()
    .should('be.visible')
    .invoke('text')
    .then(text => {
      cy.log(text)
      if (text === "Payment") {
        cy.get('body')
          .then(body => {
            if (body.find(checkoutPage.locatorEditPayment_btn).length) {
              return true
            }
          })
          .then(flag => {
            if (flag === true) {
              checkoutPage.getCheckoutEdit_btn("Edit Payment").click()
            }
          })
      }
    })
  checkoutPage.getPaymentMessage_label().should('have.text', 'What’s your payment information?')
})

Cypress.Commands.add('selectCardPaymentMethod', () => {
  cy.log('select payment method as card')
  checkoutPage.getSelPayMethodCard_radioBtn()
    .should("exist")
    .first()
    .click()
    .should('have.attr', 'aria-checked', 'true')
})

Cypress.Commands.add('clickOnNextOnPayment', () => {
  cy.intercept(`POST`, `https://**/+(carts|apply)`).as(`waitForCartApi`)
  cy.log('Click on next on payment')
  checkoutPage.getNextPayMethod_btn()
    .should('be.visible', { delay: 200 })
    .click({ force: true })
  cy.wait('@waitForCartApi', { timeout: 60000 }).then(interception => {
    cy.wrap(interception.response.statusCode).should('be.eq', 200)
  })
})

Cypress.Commands.add('verifyReviewMessage', () => {
  cy.log('Verify review message')
  checkoutPage.getReviewMessage_label()
    .should('be.visible')
    .should('have.text', 'Everything look good?')
})

Cypress.Commands.add('clickreviewButton', () => {
  cy.intercept(`POST`, `https://**/+(carts|apply)`).as(`waitForCartApi`)
  cy.log('Click on Continue To Review Button')
  if (Cypress.env('device') === "") {
    checkoutPage.continueToReview_button()
      .should('be.visible')
      .click()
    cy.wait('@waitForCartApi', { timeout: 60000 }).then(interception => {
      cy.wrap(interception.response.statusCode).should('be.eq', 200)
    })
  }
})

Cypress.Commands.add('placeOrder', () => {
  cy.intercept(`POST`, `https://**/carts/**/complete`).as(`waitForCartCompleteApi`)
  cy.intercept(`POST`, `https://**/+(carts|apply)`).as(`waitForCartApi`)
  cy.log('click on place order')
  checkoutPage.getPlaceOrder_btn()
    .should('be.visible')
    .click({ force: true })
  cy.wait(`@waitForCartCompleteApi`, { timeout: 60000 })
    .then(interception => {
      if (interception.response.statusCode === 200) {
        cy.wrap(interception.response.statusCode).should('be.eq', 200)
        let logs = JSON.stringify(interception.response.body)
        cy.once('test:after:run', (test) => addContext({ test }, logs));
      } else {
        cy.wait('@waitForCartApi', { timeout: 60000 }).then(interception => {
          cy.wrap(interception.response.statusCode).should('be.eq', 200)
        })
      }
    })
})

Cypress.Commands.add('verifyOrderPlacedMessage', () => {
  cy.log('Verify order placed message')
  checkoutPage.getOrderPlacedMsg_label()
    .should('be.visible')
    .should('have.text', 'Order placed!')
})

Cypress.Commands.add('checkoutAsGuest', () => {
  cy.log('Click on Continue As Guest Button')
  checkoutPage.getContinueAsGuest_btn()
    .wait(2000)
    .should('be.visible').click()
})

Cypress.Commands.add('verifyErrorMessage', (errorMessage) => {
  cy.log('Verify error message')
  checkoutPage.getErrorMessage_txt()
    .should('be.visible')
    .should('have.text', errorMessage)
})

Cypress.Commands.add('editShippingAddress', () => {
  checkoutPage.getAddAddress_btn().should('be.visible')
    .click()
  cy.fixture('address').then(address => {
    cy.fillCheckoutFormAddress(address.US)
  })
  checkoutPage.getUpdate_btn("AddressFooterButton").should('be.visible')
    .click()
})

Cypress.Commands.add('editPaymentForAddingNewCardDetails', () => {
  cy.wait(5000)
  checkoutPage.getCheckoutEdit_btn("Edit Payment").should('be.visible')
    .click()
  cy.wait(5000)
  cy.fixture('creditCards').then(creditCards => {
    cy.fillCheckoutFormPayment(creditCards.passing)
  })
  checkoutPage.getUpdate_btn("StepFooterButton").should('be.visible')
    .click()
})

Cypress.Commands.add('selectOrAddAddress', (address) => {
  cy.get('body').then(body => {
    if (body.find(checkoutPage.getFirstName_locator).length > 0) {
      cy.log('Adding new address')
      cy.fillCheckoutFormAddress(address)
    } else {
      cy.log('selecting existing address')
      cy.selectExistSelectedAdd()
    }
  })
})
Cypress.Commands.add('validateAndFillShippingDetails', () => {
  cy.get('button').then(button => {
    if (button.text().includes('Next')) {
      cy.fixture('address').then(address => {
        cy.fillCheckoutFormAddress(address.US)
      });
      cy.clickOnNextOnAddBook()
    } else if (button.text().includes('Update')) {
      checkoutPage.getAddressFooter_btn().contains('Update').click()
    }
    else {
      cy.editShippingAddress()
      cy.verifyDeliveryMessage()
    }
  })
})

Cypress.Commands.add('selectOrAddPayment', (payment) => {
  cy.wait(5000)
  cy.get('body').then(body => {
    if (body.find(checkoutPage.getPaymntMethod_locator).length > 0) {
      cy.log('selecting exising payment method')
      cy.selectCardPaymentMethod()
    } else {
      cy.log('adding new payment method')
      cy.fillCheckoutFormPayment(payment)
    }
  })
})

Cypress.Commands.add('validateAndAddPaymentDetails', () => {
  cy.get('body').then(body => {
    if (body.text().includes('Next')) {
      cy.fixture('creditCards').then(creditCards => {
        cy.fillCheckoutFormPayment(creditCards.passing)
      });
      checkoutPage.getNext_btn("StepFooterButton", "Next")
        .should('be.visible').click()
    }
    else {
      cy.editPaymentForAddingNewCardDetails()
      cy.verifyReviewMessage()
    }
  })
})

Cypress.Commands.add('agreeTerms', () => {
  checkoutPage.getAgreeTerms_input()
    .wait(2000)
    .should("be.visible")
    .click()
})