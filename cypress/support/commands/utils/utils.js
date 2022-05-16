//Click a link that contains text
Cypress.Commands.add('clickLink', (label) => {
    cy.get('a').contains(label).click()
})

//To Check a Token
Cypress.Commands.add('checkToken', (token) => {
    cy.window().its('localStorage.token').should('eq', token)
})

//Session Storage with key
Cypress.Commands.add('getSessionStorage', (key) => {
    cy.window().then((window) => window.sessionStorage.getItem(key))
})

//Session Storage with key and value
Cypress.Commands.add('setSessionStorage', (key, value) => {
    cy.window().then((window) => {
        window.sessionStorage.setItem(key, value)
    })
})

//Find text by class name
Cypress.Commands.add('getText', (locator) => {
    cy.get(locator).invoke('text')
})

//verify a button that contains text
Cypress.Commands.add('verifyButton', (label) => {
    cy.log(`verifyButton : ${label}`)
    cy.get('button').contains(label).should('be.visible')
})

//click a button that contains text
Cypress.Commands.add('clickButton', (label) => {
    cy.log(`clickButton : ${label}`)
    cy.get('button').contains(label).click()
})
