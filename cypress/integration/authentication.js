describe('Logging in/out', () => {
  it('Successfully Login', () => {
    cy.visit('/')
    cy.fixture('user').then(user => {
      cy.login(user)
    })
  })

  it('Successfully Logout', () => {
    cy.logOut()
  })
})
