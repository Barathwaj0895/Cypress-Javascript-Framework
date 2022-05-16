export const getOpenLeftNavPanel_btn = () => cy.get('button[aria-label=Menu]')

export const getSelectItemCategory_link = (itemCategory) => cy.get(`a[title= "${itemCategory}"]`)

export const getSelectLocale_list = () => cy.get('#locale')

export const getMenu_btn = () => cy.get('div[class^="NavigationBarFrame"] > div > ul:nth-child(1) > li:nth-child(1) > button')