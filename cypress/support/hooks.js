import "cypress-localstorage-commands"

export const getTestHooks = ({ skipTestOnFailure = true, viewPort = undefined } = {}) => {
    before(() => {
        cy.clearLocalStorageSnapshot();
        cy.clearCookies()
        cy.setSessionStorage("email-optin-modal-closed", true)
        if (Cypress.env('test_mode') !== "" && Cypress.env('test_mode') !== undefined) {
            cy.setCookie('test_mode', Cypress.env('test_mode'))
        }
    })

    beforeEach(() => {
        if (Cypress._.isArray(viewPort)) {
            cy.viewport(width, height)
        } else if (viewPort !== undefined) {
            cy.viewport(viewPort)
        }
        Cypress.on('uncaught:exception', () => {
            return false
        })
        cy.restoreLocalStorage();
        Cypress.Cookies.defaults({
            preserve: /./,
        })
    })

    afterEach(function () {
        cy.screenshot({ capture: 'runner' });
        const attempt = this.currentTest._currentRetry
        const retries = this.currentTest._retries
        if (this.currentTest.state === 'failed' && skipTestOnFailure === true && attempt === retries) {
            this.test.parent.pending = true;
        }
        cy.saveLocalStorage();
    })

    after(() => {
        cy.clearCookies()
        cy.clearLocalStorageSnapshot()
    })
}