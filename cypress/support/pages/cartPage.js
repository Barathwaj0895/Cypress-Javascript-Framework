export const getContinueToCheckout_btn = () => cy.get('a[data-qa="continue-to-checkout"]')

export const getPaypal_btn = () => cy.get('div[class^="paypal-buttons"]')

export const getCartObject_panel = () => cy.get('.js-cart [data-testid="styled-blade"]')

export const getCardProduct_info = () => cy.get('div[class^=CartProductCardInfo]')

export const getCartClose_btn = () => cy.get('button[aria-label="Cart Close"]')

export const getGooglePay_btn = () => cy.get('button[aria-label="Pay with Google Pay"]')

export const getCartEditRemove_btn = () => cy.get('button[class^=CartProductCard]')

export const getEmptyCartMessage_label = () => cy.get('div[class^="EmptyCart"]')

export const locatorCartClose = 'button[aria-label="Cart Close"]'

export const locatorCartEditRemove = 'button[class^=CartProductCard]'

export const payWithPointsInCartPage_label = () => cy.get('div[class*="PayWithPointsContainer"]')

export const getRedeemPoints_list = () => cy.get('select[id="choose-points-to-redeem"]')

export const getApplytoBag_btn = () => cy.get('button[class^="StyledButtonBlock"]').contains("Apply to Bag")

export const getSubTotal_txt = () => cy.get("p").contains("Subtotal").parent().find("span").invoke('text')

export const getGlossierRewardCash_txt = () => cy.get("p").contains("Pay with points").parent().find("span").invoke('text')

export const getTaxAmount_txt = () => cy.get("p").contains("Tax").parent().find("div > span").invoke('text')

export const getEstimatedAmount_txt = () => cy.get("p").contains("Estimated Total").parent().find("div > span").invoke('text')

export const getRemoveRedeemPoints_btn = () => cy.get('div[class^="CartScrollWindow"]').find('button[class^="Link-sc"]').contains('Remove')

export const getPayWithPointsIndicator_txt = (text) => cy.get('p[class^="Text"]').contains(text)

export const getHowManyPointsAvailable_txt = (text) => cy.get('span[class^="Text"]').contains(text)

export const getProgressBarLevel_txt = (points) => cy.get(`div[aria-valuenow="${points}"]`)

export const getListOfOptions_txt = () => cy.get('#choose-points-to-redeem').children('option')

export const getTotalOrderAmount_txt = () => cy.get('span[class^="Text"]')

export const getProductAmount_txt = (product) => cy.get('div[class^=CartProductCardInfo]').find('p').contains(product).siblings('span').invoke('text')

export const getShippingAmount_txt = () => cy.get("p").contains("Shipping").parent().find("div > span").invoke('text')

export const getPayWithPoints_txt = () => cy.get("p").contains("Pay with points")

export const getCartProductRemove_txt = (item) => cy.get('p').contains(item).parent().parent().parent().contains("Remove")
