import { getTestHooks } from "../support/hooks"

describe('Logging in/out', () => {
  getTestHooks()
  it('Successfully Login', () => {
    cy.fixture("user.json").then(user => {
      cy.loginUsingApis(user)
    })
  })

  it('Successfully Logout', () => {
    cy.logOutUsingApis()
  })
})
