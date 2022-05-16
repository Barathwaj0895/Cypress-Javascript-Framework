export const getVariantList_btn = () => cy.get('div[role=listbox]')

export const getProductName_link = () => cy.get('div[class^=ProductCardContentWrapper]>a')

//Quick View
export const getQuickView_btn = (product = "") => cy.get(`div[class^="QuickViewButtonWrapper"]>button[aria-label*="${product} quick view modal"]`)

export const getModalDialogClose_btn = () => cy.get('button[class^="modal-close"]')

export const getQuickView_panel = () => cy.get('[class^="modal is-opened"]')

export const getQuickViewImages_panel = () => cy.get('div[class^="js-carousel-nav"]')

export const getMobileQuickViewImages_panel = () => cy.get('div:not([class*="glide__slide--"]) > div[aria-label="Carousel image "]')

export const getQuickViewProdTitle_h2 = () => cy.get('h2[id$=quick-view-modal-title-id]')

export const getQuickViewWrapper_panel = () => cy.get('section[class^="KitWrapper"]')

export const getCart_btn = () => cy.get('button[aria-label="Cart Toggle"]')

export const getCartQuantity_label = () => cy.get('div[class^="CartQuantity"]')

export const getQuickViewWrapper_section_locator = 'section[class^="KitWrapper"]'

export const getAllProductsWithNoVariant = () => cy.get('ul[class*="ProductCardsListWrapper"] > li:not(:has(div[aria-label="Select Shade"],ul[aria-label="Select Your Size"]))')

export const getAllProductsWithVariant = () => cy.get('ul[class*="ProductCardsListWrapper"] > li:has(div[aria-label="Select Shade"])')
