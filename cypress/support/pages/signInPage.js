export const getAccountToggle_btn = () => cy.get('button[aria-label="Account Toggle"]')

export const getEmailSignIn_txtBox = () => cy.get('#email')

export const getPasswordSignIn_txtBox = () => cy.get('#password')

export const getSubmitLoginForm_btn = () => cy.get('[data-qa="submit-login-form"]')

export const getEmailGuest_txtBox = () => cy.get('input[type="email"]')