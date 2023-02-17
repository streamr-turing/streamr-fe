import { aliasQuery } from "../utilities/graphql-test-utils"

describe('Testing Login Page', () => {

  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'users')
      req.reply({
        fixture: 'login-users.json'
      })
    })
    cy.visit('http://localhost:3000/')
    cy.wait('@gqlusersQuery')
  })

  it('Should display the application logo', () => {
    cy.get('.logo-section').should('be.visible')
    cy.get('img').should('be.visible')
      .and('have.attr', "src", "/static/media/tv.d1669fef910821b06ff5.png")
    cy.get('h1').should('be.visible')
      .and('contain', 'Streamr')
  })

  it('Should display a username and password form with submit button', () => {
    cy.get('[type="text"]').should('be.visible')
    cy.get('[type="password"]').should('be.visible')
    cy.get('button').should('be.visible')
  })

  it('Should be able to type in a valid username and password into inputs, click submit button, and then be directed to user\'s homepage', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'fetchUser')
      req.reply({
        fixture: 'login-currentUser.json'
      })
    })
    cy.get('[type="text"]').clear()
    cy.get('[type="password"]').clear()
    cy.get('[type="text"]').type('snoop_dogg')
    cy.get('[type="password"]').type('streamr')
    cy.get('[type="text"]').should("have.value", "snoop_dogg")
    cy.get('[type="password"]').should("have.value", "streamr")
    cy.get('button').click()
    cy.wait('@gqlfetchUserQuery')
  })

  it('Should see an invalid username/ password message if input an invalid username and click submit', () => {
    cy.get('[type="text"]').clear().type('banana')
    cy.get('button').click()

    cy.get('p').should('be.visible')
      .and('contain', 'Sorry, the username/password is incorrect. Please try again.')
  })

  it('Should see an invalid username/ password message if input an invalid password and click submit', () => {
    cy.get('[type="password"]').clear().type('banana')
    cy.get('button').click()

    cy.get('p').should('be.visible')
      .and('contain', 'Sorry, the username/password is incorrect. Please try again.')
  })

  it('Should see an invalid username/ password message if username input is left empty and click submit', () => {
    cy.get('[type="text"]').clear()
    cy.get('button').click()

    cy.get('p').should('be.visible')
      .and('contain', 'Sorry, the username/password is incorrect. Please try again.')
  })

  it('Should see an invalid username/ password message if password input is left empty and click submit', () => {
    cy.get('[type="password"]').clear()
    cy.get('button').click()

    cy.get('p').should('be.visible')
      .and('contain', 'Sorry, the username/password is incorrect. Please try again.')
  })

  it('Should see an invalid username/ password message if password and username inputs are left empty and click submit', () => {
    cy.get('[type="text"]').clear()
    cy.get('[type="password"]').clear()
    cy.get('button').click()

    cy.get('p').should('be.visible')
      .and('contain', 'Sorry, the username/password is incorrect. Please try again.')
  })
})

describe("Login Page (bad response)", () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      switch (req.body.operationName) {
        case "users":
          aliasQuery(req, "users")
          req.reply({ fixture: "login-users.json" })
          break
        case "fetchUser":
          aliasQuery(req, "fetchUser")
          req.reply({ fixture: "bad-response.json" })
          break
      }
    })
    cy.visit("http://localhost:3000/")
    cy.wait("@gqlusersQuery")
    cy.get("button").click()
    cy.wait("@gqlfetchUserQuery")
  })

  it("should redirect to Error Component if there is a bad response", () => {
    cy.get('.error').should('be.visible')
    cy.get('[d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.986 1.986 0 0 0 .054 1.968A1.984 1.984 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.989 1.989 0 0 0 .054-1.968L13.768 4.2zM4.661 19 12 5.137 19.344 19H4.661z"]').should('be.visible')
    cy.get('[d="M20 3H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 9V5h16v4zm16 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM4 19v-4h16v4z"]').should('be.visible')
    cy.get('.oops').should('be.visible')
    .and('contain', 'Bummer! The server isn\'t responding.')
    cy.get('.message').should('be.visible')
    .and('contain', 'Our team is working on it! Come back later!')
  })
})