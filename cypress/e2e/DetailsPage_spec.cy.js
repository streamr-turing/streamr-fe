import { aliasQuery } from "../utilities/graphql-test-utils"

describe("Details Page", () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      switch (req.body.operationName) {
        case "users":
          aliasQuery(req, "users")
          req.reply({ fixture: "login-users.json" })
          break
        case "fetchUser":
          aliasQuery(req, "fetchUser")
          req.reply({ fixture: "DetailsPage-currentUser.json" })
          break
        case "showDetails":
          aliasQuery(req, "showDetails")
          req.reply({ fixture: "DetailsPage-showDetails.json" })
          break
      }
    })
    cy.visit("http://localhost:3000/")
    cy.wait("@gqlusersQuery")
    cy.get("button").click()
    cy.wait("@gqlfetchUserQuery")
    cy.get(".home-container a").first().click()
    cy.wait("@gqlshowDetailsQuery")
  })

  it("should display the correct show data", () => {
    cy.getByData("poster").invoke("attr", "src").should("eq", "https://image.tmdb.org/t/p/w500/k3RbNzPEPW0cmkfkn1xVCTk3Qde.jpg")
    cy.getByData("details-title").should("have.text", "30 Rock (2006)")
    cy.getByData("provider-icons").find("img").should("have.length", 2)
      .first().invoke("attr", "src").should("eq", "https://image.tmdb.org/t/p/w500/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg")
    cy.getByData("provider-icons").find("img").last().invoke("attr", "src").should("eq", "https://image.tmdb.org/t/p/w500/xTHltMrZPAJFLQ6qyCBjAnXSmZt.jpg")
    cy.getByData("genres").should("have.text", "Comedy, Another Genre")
    cy.getByData("rating").should("have.text", "7/10 ⭐️")
    cy.getByData("summary").should("have.text", "Liz Lemon, the head writer for a late-night TV variety show in New York, tries to juggle all the egos around her while chasing her own dream.")
  })

  it("should display the correct recommenders", () => {
    cy.getByData("avatars-container").find('[data-cy=avatar-container]').should("have.length", 3)
    cy.getByData("avatars-container").find("img").eq(0).invoke("attr", "src").should("eq", "https://cdn-icons-png.flaticon.com/512/3940/3940448.png")
    cy.getByData("avatars-container").find("p").eq(0).should("have.text", "martha_stewart")
    cy.getByData("avatars-container").find("img").eq(1).invoke("attr", "src").should("eq", "https://cdn-icons-png.flaticon.com/512/3940/3940405.png")
    cy.getByData("avatars-container").find("p").eq(1).should("have.text", "james-white-rules")
    cy.getByData("recc-container").contains("and other friends")
  })

  it("should be able to open the \"send recommendation\" modal", () => {
    cy.getByData("open-modal").click()
    cy.getByData("recc-modal").should("be.visible")
  })
})

describe("Details Page (missing data)", () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      switch (req.body.operationName) {
        case "users":
          aliasQuery(req, "users")
          req.reply({ fixture: "login-users.json" })
          break
        case "fetchUser":
          aliasQuery(req, "fetchUser")
          req.reply({ fixture: "DetailsPage-currentUser.json" })
          break
        case "showDetails":
          aliasQuery(req, "showDetails")
          req.reply({ fixture: "DetailsPage-showDetails-missing.json" })
          break
      }
    })
    cy.visit("http://localhost:3000/")
    cy.wait("@gqlusersQuery")
    cy.get("button").click()
    cy.wait("@gqlfetchUserQuery")
    cy.get(".home-container a").first().click()
    cy.wait("@gqlshowDetailsQuery")
  })

  it("should not show a table row for streaming providers if there are none available", () => {
    cy.getByData("provider-icons").should("not.exist")
  })

  it("should not try to show the list of recommenders if there are none", () => {
    cy.getByData("recc-container").should("not.contain", "Recommended by Friends:")
  })
})

describe("Details Page (bad response)", () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      switch (req.body.operationName) {
        case "users":
          aliasQuery(req, "users")
          req.reply({ fixture: "login-users.json" })
          break
        case "fetchUser":
          aliasQuery(req, "fetchUser")
          req.reply({ fixture: "DetailsPage-currentUser.json" })
          break
        case "showDetails":
          aliasQuery(req, "showDetails")
          req.reply({ fixture: "bad-response.json" })
          break
      }
    })
    cy.visit("http://localhost:3000/")
    cy.wait("@gqlusersQuery")
    cy.get("button").click()
    cy.wait("@gqlfetchUserQuery")
    cy.get(".home-container a").first().click()
    cy.wait("@gqlshowDetailsQuery")
  })

  it("should redirect to Error Component if there is a bad response", () => {
    cy.url().should("eq", "http://localhost:3000/error")
    cy.get('.error').should('be.visible')
    cy.get('[d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.986 1.986 0 0 0 .054 1.968A1.984 1.984 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.989 1.989 0 0 0 .054-1.968L13.768 4.2zM4.661 19 12 5.137 19.344 19H4.661z"]').should('be.visible')
    cy.get('[d="M20 3H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 9V5h16v4zm16 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM4 19v-4h16v4z"]').should('be.visible')
    cy.get('.oops').should('be.visible')
    .and('contain', 'Bummer! The server isn\'t responding.')
    cy.get('.message').should('be.visible')
    .and('contain', 'Our team is working on it! Come back later!')
  })
})

describe('Testing Details Page Navigation to Home View, Search View, and Watch List View', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'users')
      req.reply({
        fixture: 'login-users.json'
      })
    })
    cy.visit('http://localhost:3000/')
    cy.wait('@gqlusersQuery')

    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'fetchUser')
      req.reply({
        fixture: 'home-view-currentUser-recommendations.json'
      })
    })
    cy.get('button').click()
    cy.wait('@gqlfetchUserQuery')

    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'showDetails')
      req.reply({
        fixture: 'home-view-showDetails-30Rock.json'
      })
    })
    cy.get('.poster-img').eq(0).click()
    cy.wait('@gqlshowDetailsQuery')
  })

  it('Should navigate to Home View after clicking on "Home" link', () => {
    cy.get('p').eq(1).click()
    cy.get('.recommend-title').should('contain', 'Recommended By Friends')
  })

  it('Should navigate to Search View after entering show title in search bar via clicking magnifying glass button', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'shows')
      req.reply({
        fixture: 'home-view-shows-KingOfQueens.json'
      })
    })
    cy.get('.search-input').type('king of queens')
    cy.get('.magnifying-glass-icon').click()
    cy.wait('@gqlshowsQuery')
    cy.get('.search-title').should('contain', 'Search Results for "king of queens"')
  })

  it('Should navigate to Search View after entering show title in search bar via pressing enter', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'shows')
      req.reply({
        fixture: 'home-view-shows-KingOfQueens.json'
      })
    })
    cy.get('.search-input').type('king of queens{enter}')
    cy.wait('@gqlshowsQuery')
    cy.get('.search-title').should('contain', 'Search Results for "king of queens"')
  })

  it('Should navigate to Watch List View after clicking "Watchlist"', () => {
    cy.get('p').eq(2).click()
    cy.get('.watch-list-title').should('contain', 'My Watch List')
  })
})