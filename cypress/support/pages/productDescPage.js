export const getVariantListPDP_btn = (product, variant) => cy.get(`button[aria-label^="${product} ${variant}"]`)

export const getSetProductPDP_btn = (product) =>cy.get(`button[aria-label^="${product}"]`)

export const getAddToBag_btn = (type) => cy.get(`div[type="${type}"],section[class^="KitWrapper"]>button[data-qa="kit-atb"]`)

export const getAddToBag_parent_btn = (parent) => cy.get(`${parent}>button[data-qa=kit-atb]`)

export const getAddQuantity_btn = () => cy.get('button[aria-label^="Add 1"]')

export const removeQuantity_btn = () => cy.get('button[aria-label^="Remove 1"]')

export const getCarousalNavigation_btn = () => cy.get('*[class^="js-carousel-nav"]')

export const getCarousalImage_btn = () => cy.get('button[aria-label="Carousel image 2"]')

export const getStyledBlade_btn = () => cy.get('.js-cart [data-testid="styled-blade"]')

//Gift card elements
export const getGiftCardAmount_dropDown = () => cy.get('select#giftCardVariants')

export const getGiftDelivery_dropDown = () => cy.get('select#giftCardDeliveryOptions')

export const getGiftCardDate_txtBox = () => cy.get('input#gift-card-date')

export const getGiftCardCalDate_link = (date) => cy.get(`span[aria-label="${date}"]`)

export const getGiftCardRecipientName_txtBox = () => cy.get('input#recipientName')

export const getGiftCardPurchaserName_txtBox = () => cy.get('input#purchaserName')

export const getGiftCardRecipientEmail_txtBox = () => cy.get('input#recipientEmail')

export const getGiftcardMessage_txtBox = () => cy.get('textarea#giftcardMessage')

export const getGiftCardAddToBag_btn = (parent) => cy.get(`${parent}>button[class^=StyledButtonBlock]`)

// pdp Navigation

export const getTitle = () => cy.get('a[title="Fragrance"]')

export const getPCIWrapper = () => cy.get('*[class^="ProductCardImagesWrapper"]')

export const getQuantity_span = () => cy.get('*[class*="QuantityWidgetWrapper"]>span')

// plp Navigation

export const getPlpProduct = (pName) => cy.get(`li[data-synth-test*="${pName}"]`)

export const getQuickViewWrapper_btn = () => cy.get('div[class^="QuickViewButtonWrapper"]')

export const getPlpmodal_view = () => cy.get('[class^="modal is-opened"]')

export const getModalInnerContent_view = () => cy.get('.modal-inner-content')

export const getGlossiWear = () => cy.get('select[id*="glossi-wear"]')

export const getPlpAddToBag_btn = () => cy.get(`button[data-qa="kit-atb"]`)

// product review

export const getReview_btn = () => cy.get('a[href$="/reviews"]')

export const getScoreStar_btn = () => cy.get('span[data-score="5"]')

export const getReviewTitle_txtBox = () => cy.get('input[name="review_title"]')

export const getDetailedReview_txtBox = () => cy.get('textarea[name="review_content"]')

export const getValueforMoney = (value) => cy.get(`input[value="${value}"]`)

export const getUserName_txtBox = () => cy.get('input[name="display_name"]')

export const getUserEmail_txtBox = () => cy.get('input[id="yotpo_input_review_email"]')

export const getSubmit_btn = () => cy.get('input[data-button-type="submit"]')

export const getReviewConfirmation_txt = () => cy.get('div[class="yotpo-thankyou-header text-3xl"]')

export const getAllProductsWithoutVarient_div = () => cy.get('ul[class*="ProductCardsListWrapper"] > li:not(:has(div[aria-label="Select Shade"]))').find('*[class^="ProductCardImagesWrapper"]')