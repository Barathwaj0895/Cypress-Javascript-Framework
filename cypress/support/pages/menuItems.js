export const getSelectMenuItemCategory_link = (itemCategory) => cy.get(`a[title= "${itemCategory}"][role="menuitem"]`)

export const getItemNavList = () =>  cy.get('ul[class="UnorderedListNaked-sc-1fv40fl-0 link-list  NavList-sc-1t0nw3f-0 fVAbRZ"]').scrollTo('center')
