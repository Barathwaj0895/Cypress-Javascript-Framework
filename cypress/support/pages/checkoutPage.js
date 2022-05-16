//Shipping address selection screen
export const getShippingMessage_label = () => cy.get('div > #Shipping')

export const getSelExistDlvryAdd_radioBtn = () => cy.get('input[name="address-radio-group"]')

export const getNextAddBook_btn = () => cy.get('button[class^="AddressFooterButton"]').contains('Next')

export const getEditShipping_btn = () => cy.get('button[aria-label="Edit Shipping"]')

export const getAddAddress_btn = () => cy.get('span[class^="Text"]').contains("Add another address")

export const locatorEditShipping_btn = 'button[aria-label="Edit Shipping"]'

//Delivery method selection screen
export const getDeliveryMessage_label = () => cy.get('div > #Delivery')

export const getSelDelMethod_radioBtn = () => cy.get('input[name="borderedGroupSubtext"]')

export const selectShippingOptions = () => cy.get('div[aria-label="Select a shipping option"]')

export const getNextDelMethod_btn = () => cy.get('button[data-qa="submit-selected-shipping-method"]')

export const getEditDelivery_btn = () => cy.get('button[aria-label="Edit Delivery"]')

export const locatorEditDelivery_btn = 'button[aria-label="Edit Delivery"]'

//Payment selection screen
export const getPaymentMessage_label = () => cy.get('div > #Payment')

export const getSelPayMethodCard_radioBtn = () => cy.get('input[name="payment-wallet"][id^=payment-walletcard],[id^=payment-wallettok]')

export const getSelPayMethodAfterPay_radioBtn = () => cy.get('input[name="payment-wallet"][id^=payment-walletAfterpay]')

export const getSelPayMethodPaypal_radioBtn = () => cy.get('input[name="payment-wallet"][id^=payment-walletPayPal]')

export const getNextPayMethod_btn = () => cy.get('button[class^="StepFooterButton"]')

export const getCheckoutEdit_btn = (editButton) => cy.get(`button[aria-label="${editButton}"]`)

export const locatorEditPayment_btn = 'button[aria-label="Edit Payment"]'

export const getUpdate_btn = (footer) => cy.get(`button[class^="${footer}"]`).contains("Update")

export const getNext_btn = (footer, text) => cy.get(`button[class^="${footer}"]`).contains(text)

//Review or payment confirmation screen
export const getReviewMessage_label = () => cy.get('div > #Review')

export const continueToReview_button = () => cy.get('.StepFooterButton-sc-1gwmr3r-4')

export const getPlaceOrder_btn = () => cy.get('button[data-qa="confirm-cart"]')

//After Order places screen
export const getOrderPlacedMsg_label = () => cy.get('div[aria-label="Order Summary"]>div>h1')
export const getOrderSummary_panel = () => cy.get('[aria-label="Order Summary"]')

//Guest User Screen
export const getContinueAsGuest_btn = () => cy.get('button[data-qa="continue-as-guest"]')

//Adding Address
export const getCountry_txtBox = () => cy.get('#address-country')
export const getFirstName_TxtBox = () => cy.get('input[name="firstname"]')
export const getLastName_txtBox = () => cy.get('input[name="lastname"]')
export const getAddress_txtBox = () => cy.get('input[name="address1"]')
export const getAddress2_txtBox = () => cy.get('input[name="address2"')
export const getCity_txtBox = () => cy.get('input[name="city"]')
export const getState_txtBox = () => cy.get('#address-states')
export const getZIPCode_txtBox = () => cy.get('input[name="zipcode"]')
export const getPhone_txtBox = () => cy.get('input[name="phone"]')
export const getErrorMessage_txt = () => cy.get('div[aria-live="polite"] p').first()
export const getCardNumber_txtBox = () => cy.get('input[name="cardnumber"]')
export const getExpDate_txtBox = () => cy.get('input[name="exp-date"]')
export const getCvc_txtBox = () => cy.get('input[name="cvc"]')
export const getPostal_txtBox = () => cy.get('input[name="postal"]')
export const getCheckoutEmail_txtBox = () => cy.get('#email-address')
export const getAddressFooter_btn = () => cy.get('button[class^="AddressFooterButton"]')

export const getFirstName_locator = 'input[name="firstname"]'
export const getPaymntMethod_locator = 'input[name="payment-wallet"][id^=payment-walletcard],[id^=payment-wallettok]'

export const getAgreeTerms_input = () => cy.get('input[name="agree_terms"]')