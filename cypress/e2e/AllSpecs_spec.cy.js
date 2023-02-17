import { aliasQuery, aliasMutation } from "../utilities/graphql-test-utils"

describe("Adding/Removing from Watchlist", () => {
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
        case "deleteWatchlistItem":
          aliasQuery(req, "deleteWatchlistItem")
          req.reply({ fixture: "deleteWatchlistItem.json" })
          break
        case "createWatchlistItem":
          aliasQuery(req, "createWatchlistItem")
          req.reply({ fixture: "createWatchlistItem.json" })
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

  it("should indicate if a show has been previously saved to the watchlist on the Details Page", () => {
    cy.getByData("bookmark").invoke("attr", "src").should("include", "true")
  })

  it("should visually toggle the bookmark's state on the Details Page", () => {
    cy.getByData("bookmark").click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.getByData("bookmark").invoke("attr", "src").should("include", "false")
    cy.getByData("bookmark").click()
    cy.wait("@gqlcreateWatchlistItemQuery")

    cy.getByData("bookmark").invoke("attr", "src").should("include", "true")
  })

  it("bookmarking/unbookmarking from the Details Page should affect state across the entire app", () => {
    cy.get("#watchlist-button").click()
    cy.get(':nth-child(4) > .watch-list-poster-and-info > [data-cy="bookmark"]').invoke("attr", "src").should("include", "true")
    cy.get(".search-input").type("30 Rock")
    cy.get(".magnifying-glass-icon").click()
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').invoke("attr", "src").should("include", "true")
    cy.get('#home-button').click()
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').invoke("attr", "src").should("include", "true")
  
    cy.getByData("poster-4608-sean_not_shaun").click()
    cy.getByData("bookmark").click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.get("#watchlist-button").click()
    cy.get('.watch-list-container > :nth-child(4)').should("not.exist")
    cy.get(".search-input").type("30 Rock")
    cy.get(".magnifying-glass-icon").click()
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').invoke("attr", "src").should("include", "false")
    cy.get('#home-button').click()
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').invoke("attr", "src").should("include", "false")
  })

  it("should indicate if a show has been previously saved to the watchlist on the Home Page", () => {
    cy.get('#home-button').click()
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').invoke("attr", "src").should("include", "true")
  })

  it("should visually toggle the bookmark's state on the Home Page", () => {
    cy.get('#home-button').click()
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').invoke("attr", "src").should("include", "false")
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').click()
    cy.wait("@gqlcreateWatchlistItemQuery")

    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').invoke("attr", "src").should("include", "true")
  })

  it("bookmarking/unbookmarking from the Home Page should affect state across the entire app", () => {
    cy.get('#home-button').click()
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.get("#watchlist-button").click()
    cy.get('.watch-list-container > :nth-child(4)').should("not.exist")
    cy.get(".search-input").type("30 Rock")
    cy.get(".magnifying-glass-icon").click()
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').invoke("attr", "src").should("include", "false")
    cy.getByData("poster-4608").click()
    cy.getByData("bookmark").invoke("attr", "src").should("include", "false")
  })

  it("should indicate if a show has been previously saved to the watchlist on the Search Page", () => {
    cy.get(".search-input").type("30 Rock")
    cy.get(".magnifying-glass-icon").click()
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').invoke("attr", "src").should("include", "true")
  })

  it("should visually toggle the bookmark's state on the Search Page", () => {
    cy.get(".search-input").type("30 Rock")
    cy.get(".magnifying-glass-icon").click()
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').invoke("attr", "src").should("include", "false")
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').click()
    cy.wait("@gqlcreateWatchlistItemQuery")
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').invoke("attr", "src").should("include", "true")
  })

  it("bookmarking/unbookmarking from the Search Page should affect state across the entire app", () => {
    cy.get(".search-input").type("30 Rock")
    cy.get(".magnifying-glass-icon").click()
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.get('#home-button').click()
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').invoke("attr", "src").should("include", "false")
    cy.get('[data-cy="poster-4608-sean_not_shaun"]').click()
    cy.getByData("bookmark").invoke("attr", "src").should("include", "false")
    cy.get("#watchlist-button").click()
    cy.get('.watch-list-container > :nth-child(4)').should("not.exist")
  })

  it("should immediately remove an item from the watchlist", () => {
    cy.get("#watchlist-button").click()
    cy.get(':nth-child(4) > .watch-list-poster-and-info > [data-cy="bookmark"]').click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.get('.watch-list-container > :nth-child(4)').should("not.exist")
  })

  it("bookmarking/unbookmarking from the watchlist should affect state across the entire app", () => {
    cy.get("#watchlist-button").click()
    cy.get(':nth-child(4) > .watch-list-poster-and-info > [data-cy="bookmark"]').click()
    cy.wait("@gqldeleteWatchlistItemQuery")

    cy.get('#home-button').click()
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .home-bookmark').invoke("attr", "src").should("include", "false")
    cy.get('[data-cy="poster-4608-sean_not_shaun"]').click()
    cy.getByData("bookmark").invoke("attr", "src").should("include", "false")
    cy.get(".search-input").type("30 Rock")
    cy.get(".magnifying-glass-icon").click()
    cy.get(':nth-child(1) > [data-cy="bookmark-tile"]').invoke("attr", "src").should("include", "false")
  })
})

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

describe('Testing Home Page Header, Page Name, and Nav Bar', () => {
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
  })

  it('Should show Streamr logo in the header', () => {
      cy.get('h1').eq(0).should('contain', 'Streamr')
      cy.get('img').eq(2).should('have.attr', 'src', '/static/media/tv.d1669fef910821b06ff5.png')
  })

  it('Should display main with page name', () => {
      cy.get('.recommend-title').should('contain', 'Recommended By Friends')
  })

  it('Should display logged in user\'s avatar image, avatar name, search bar, magnifying glass button, and "My Watchlist" link', () => {
      cy.get('img').eq(0).should('have.attr', 'src', 'https://cdn-icons-png.flaticon.com/512/3940/3940414.png')
      cy.get('p').eq(0).should('contain', 'snoop_dogg')
      cy.get('.search-input').should('be.visible')
      cy.get('.magnifying-glass-icon').should('be.visible')
      cy.get('p').eq(2).should('contain', 'My Watchlist')
  })
})

describe('Testing Home Page Navigation to Detail, Search View, and Watch List View', () => {
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
  })

  it('Should navigate to Detail View after clicking on show poster', () => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'showDetails')
          req.reply({
              fixture: 'home-view-showDetails-30Rock.json'
          })
      })
      cy.get('.poster-img').eq(0).click()
      cy.wait('@gqlshowDetailsQuery')
      cy.getByData("details-title").should('contain', '30 Rock (2006)')
  })

  it('Should navigate to Detail View after clicking on show name', () => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'showDetails')
          req.reply({
              fixture: 'home-view-showDetails-30Rock.json'
          })
      })
      cy.get('.title').eq(0).click()
      cy.wait('@gqlshowDetailsQuery')
      cy.getByData("details-title").should('contain', '30 Rock (2006)')
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

describe('Testing Home Page If Given Recommended Shows', () => {
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
  })
  
  it('Should display recommenders avatar and name', () => {
      cy.get('.recommender-avatar').eq(0).should('have.attr', 'src', 'https://cdn-icons-png.flaticon.com/512/3940/3940448.png')
      cy.get('.recommender-name').eq(0).should('contain', 'martha_stewart')

      cy.get('.recommender-avatar').eq(1).should('have.attr', 'src', 'https://cdn-icons-png.flaticon.com/512/3940/3940405.png')
      cy.get('.recommender-name').eq(1).should('contain', 'james-white-rules')
  })

  it('Should display 30 Rock show card', () => {
      cy.get('.recommendee-card-container').eq(0).should('be.visible')
      cy.get('.title').eq(0).should('contain', '30 Rock (2006)')
      cy.get('.audience-rating').eq(0).should('contain', 'Audience Rating: 7.5/10')
      cy.get('h3').eq(0).should('contain', 'Comedy')
      cy.get('.poster-img').eq(0).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500/k3RbNzPEPW0cmkfkn1xVCTk3Qde.jpg')
      cy.get('.home-bookmark').eq(0).should('have.attr', 'src', '/static/media/bookmark-true.a3c72626dc6f7f69e770.png')
  })

  it('Should display Parks and Recreation show card', () => {
      cy.get('.recommendee-card-container').eq(1).should('be.visible')
      cy.get('.title').eq(1).should('contain', 'Parks and Recreation (2009)')
      cy.get('.audience-rating').eq(1).should('contain', 'Audience Rating: 8/10')
      cy.get('h3').eq(1).should('contain', 'Comedy')
      cy.get('.poster-img').eq(1).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500/5IOj62y2Eb2ngyYmEn1IJ7bFhzH.jpg')
      cy.get('.home-bookmark').eq(1).should('have.attr', 'src', '/static/media/bookmark-true.a3c72626dc6f7f69e770.png')
  })

  it('Should display posted times for each post', () => {
      cy.get('.timeline-circle').eq(0).should('be.visible')
      cy.get('.post-date').eq(0).should('contain', 'Feb 12 2023')

      cy.get('.timeline-circle').eq(1).should('be.visible')
      cy.get('.post-date').eq(0).should('contain', 'Feb 12 2023')
  })

  it('Should create timeline segement between the two shows', () => {
      cy.get('.timeline-tail').eq(0).should('be.visible')
  })

  it('Should display "End of feed" at end of timeline', () => {
      cy.get('.end-of-feed-message').should('be.visible')
  })
})

describe('Testing Home Page If Not Given Recommended Shows', () => {
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
              fixture: 'home-view-currentUser-no-recommendations.json'
          })
      })
      cy.get('button').click()
      cy.wait('@gqlfetchUserQuery')
  })

  it('Should display main with page name', () => {
      cy.get('.recommend-title').should('contain', 'Recommended By Friends')
  })

  it('Should display "No recommendations" messages with tv image', () => {
      cy.get('.shrug-img').should('be.visible')
      cy.get('h2').should('contain', 'No recommendations today. Try again later')
  })
})

describe('Testing Loading Message', () => {
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
  })

  it('Should show "Loading..." message after clicking on show poster to go to Detail View', () => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'showDetails')
          req.reply({
              fixture: 'home-view-showDetails-30Rock.json',
              delay: 2000
          })
      })
      cy.get('.poster-img').eq(0).click()
      cy.get('.loading-text').should('contain', 'Loading...')
      cy.wait('@gqlshowDetailsQuery')
  })

  it('Should show "Loading..." message after entering a show title in search bar to go to Search View', () => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'shows')
          req.reply({
              fixture: 'loading-shows-searchA.json',
              delay: 2000
          })
      })
      cy.get('.search-input').type('a')
      cy.get('.magnifying-glass-icon').click()
      cy.get('.loading-text').should('contain', 'Loading...')
      cy.wait('@gqlshowsQuery')
  })
})

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

describe('Testing Recommendation Modal', () => {

  beforeEach(() => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'users')
          req.reply({
            fixture: 'recModal-users.json'
          })
        })
        cy.visit('http://localhost:3000/')
        cy.wait('@gqlusersQuery')
    
        cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'fetchUser')
          req.reply({
            fixture: 'recModal-currentUser.json'
          })
        })
        cy.get('button').click()
        cy.wait('@gqlfetchUserQuery')
        cy.get('#watchlist-button > p').click()
        cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .share-button').click()
  })

  it('Should display all user\'s friends with associated checkboxes', () => {

      cy.get('.friend-list').should('be.visible')
      cy.get('.friend-list > :nth-child(1)').should('be.visible')
      cy.get(':nth-child(1) > .label').should('be.visible')
      .and('contain', 'martha_stewart')
      cy.get('form').find('[value="2"]').should('be.visible')
      cy.get('.friend-list > :nth-child(2)').should('be.visible')
      cy.get(':nth-child(2) > .label').should('be.visible')
      .and('contain', 'james-white-rules')
      cy.get('form').find('[value="3"]').should('be.visible')
      cy.get('.friend-list > :nth-child(3)').should('be.visible')
      cy.get(':nth-child(3) > .label').should('be.visible')
      .and('contain', 'sean_not_shaun')
      cy.get('form').find('[value="4"]').should('be.visible')
      cy.get('.friend-list > :nth-child(4)').should('be.visible')
      cy.get(':nth-child(4) > .label').should('be.visible')
      .and('contain', 'the_burger_king')
      cy.get('form').find('[value="5"]').should('be.visible')
  })

  it('Should display send recommendation modal when user clicks share button', () => {

      cy.get('.modalContainer').should('be.visible')
      cy.get('[data-cy="recc-modal"]').should('be.visible')

  })

  it('Should be able to check all checkboxes', () => {

      cy.get('[type="checkbox"]').check('2')
      cy.get('[type="checkbox"]').check('3')
      cy.get('[type="checkbox"]').check('4')
      cy.get('[type="checkbox"]').check('5')

  })

  it('Should be able to uncheck checked checkboxes', () => {

      cy.get('[type="checkbox"]').check('2')
      cy.get('[type="checkbox"]').uncheck('2')
      cy.get('[type="checkbox"]').check('3')
      cy.get('[type="checkbox"]').uncheck('3')
      cy.get('[type="checkbox"]').check('4')
      cy.get('[type="checkbox"]').uncheck('4')
      cy.get('[type="checkbox"]').check('5')
      cy.get('[type="checkbox"]').uncheck('5')

  })

  it('Should be able to close out of Modal by clicking the X button at the top of the Modal', () => {
      cy.get('.modalContainer').should('exist')
      cy.get('.titleCloseBtn').click()
      cy.get('.modalContainer').should('not.exist')
  })

  it('Should be able to check a friend checkbox, click send button, and a sent message will appear and then disappear after 1000ms if recommendation was sent', () => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasMutation(req, 'createRecommendation')
          req.reply({
            fixture: 'recModal-createRecommendation-sean.json'
          })
        })
      cy.get('[type="checkbox"]').check('4')
      cy.get('.body > button').click()
      cy.wait('@gqlcreateRecommendationMutation')
      cy.get('.sent-container').should('be.visible')
      cy.get('.sent-text').should('be.visible')
      cy.get('.sent-container', { timeout: 1500 }).should('not.exist')
      cy.get('.sent-text', { timeout: 1500 }).should('not.exist')
  })

  it('Should be able to check a friend checkbox, click send button, and a failed message will appear and then disappear after 1500ms if recommendation failed to send', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
        aliasMutation(req, 'createRecommendation')
        req.reply({
          fixture: 'bad-response.json'
        })
      })
    cy.get('[type="checkbox"]').check('4')
    cy.get('.body > button').click()
    cy.wait('@gqlcreateRecommendationMutation')
    cy.get('.failed-container').should('be.visible')
    cy.get('.failed-text').should('be.visible')
    cy.get('.failed-container', { timeout: 2000 }).should('not.exist')
    cy.get('.failed-text', { timeout: 2000 }).should('not.exist')
})

})

describe('Testing that the send recommendations modal displays when clicking the share button from different page views', () => {

  beforeEach(() => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'users')
          req.reply({
            fixture: 'recModal-users.json'
          })
        })
        cy.visit('http://localhost:3000/')
        cy.wait('@gqlusersQuery')
    
        cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'fetchUser')
          req.reply({
            fixture: 'recModal-currentUser.json'
          })
        })
        cy.get('button').click()
        cy.wait('@gqlfetchUserQuery')

  })

  it('Should display send recommendation modal when user clicks share button on Watchlist View', () => {
      cy.get('#watchlist-button > p').click()
      cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .share-button').click()

      cy.get('.modalContainer').should('be.visible')
      cy.get('[data-cy="recc-modal"]').should('be.visible')

  })

  it('Should display send recommendation modal when user clicks share button on Details View', () => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'showDetails')
          req.reply({
            fixture: 'recModal-showDetails-30Rock.json'
          })
      })
      cy.get(':nth-child(2) > :nth-child(3) > .recommendee-card-container > .clickable-poster > .poster-img').click()
      cy.wait('@gqlshowDetailsQuery')
      cy.get('[data-cy="open-modal"]').click()

      cy.get('.modalContainer').should('be.visible')
      cy.get('[data-cy="recc-modal"]').should('be.visible')

  })

})

describe('Testing send recommendation Modal display when user has no other users to send to', () => {

  beforeEach(() => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'users')
          req.reply({
            fixture: 'recModal-users-only-one.json'
          })
        })
        cy.visit('http://localhost:3000/')
        cy.wait('@gqlusersQuery')
    
        cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'fetchUser')
          req.reply({
            fixture: 'recModal-currentUser.json'
          })
        })
        cy.get('button').click()
        cy.wait('@gqlfetchUserQuery')
        cy.get('#watchlist-button > p').click()
        cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .share-button').click()

  })

  it('Should display "Add Some Friends!" message on the Modal View if the user does not have any users to send recommendations to', () => {
      cy.get('.modalContainer').should('be.visible')
      cy.get('[data-cy="recc-modal"]').should('be.visible')
      cy.get('.friend-list > p').should('be.visible')
      .and('contain', 'Add some friends!')
      cy.get('.titleCloseBtn').click()
      cy.get('.modalContainer').should('not.exist')

  })

  it('Should be able to close out of Modal with "Add some friends" message by clicking the X button', () => {
      cy.get('.modalContainer').should('be.visible')
      cy.get('[data-cy="recc-modal"]').should('be.visible')
      cy.get('.friend-list > p').should('be.visible')
      .and('contain', 'Add some friends!')
      cy.get('.titleCloseBtn').click()
      cy.get('.modalContainer').should('not.exist')

  })

})


describe("RecModal (bad response)", () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      switch (req.body.operationName) {
        case "users":
          aliasQuery(req, "users")
          req.reply({ fixture: "login-users.json" })
          break
        case "fetchUser":
          aliasQuery(req, "fetchUser")
          req.reply({ fixture: "recModal-currentUser.json" })
          break
        case "showDetails":
          aliasQuery(req, "showDetails")
          req.reply({ fixture: "recModal-showDetails-30Rock.json" })
          break
        case "allUsers":
          aliasQuery(req, "allUsers")
          req.reply({fixture: "bad-response.json"})
      }
    })
    cy.visit("http://localhost:3000/")
    cy.wait("@gqlusersQuery")
    cy.get("button").click()
    cy.wait("@gqlfetchUserQuery")
    cy.get(':nth-child(1) > :nth-child(3) > .recommendee-card-container > .clickable-poster > .poster-img').click()
    cy.wait("@gqlshowDetailsQuery")
    cy.get('[data-cy="open-modal"]').click()
    cy.wait("@gqlallUsersQuery")


  })

  it("should redirect to Error Component if there is a bad response", () => {
    cy.get('.modalContainer').should('be.visible')
    cy.get('.modalContainer > .error').should('be.visible')
    cy.get('[d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.986 1.986 0 0 0 .054 1.968A1.984 1.984 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.989 1.989 0 0 0 .054-1.968L13.768 4.2zM4.661 19 12 5.137 19.344 19H4.661z"]').should('be.visible')
    cy.get('[d="M20 3H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 9V5h16v4zm16 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM4 19v-4h16v4z"]').should('be.visible')
    cy.get('.modalContainer > .error > .oops').should('be.visible')
    cy.get('.modalContainer > .error > .message').should('be.visible')
  })
})

describe('Testing Search Page Header, Nav Bar, and Page Name', () => {
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
          aliasQuery(req, 'shows')
          req.reply({
              fixture: 'search-view-shows-spongebob.json'
          })
      })
      cy.get('.search-input').type('spongebob')
      cy.get('.magnifying-glass-icon').click()
      cy.wait('@gqlshowsQuery')
  })

  it('Should show Streamr logo in the header', () => {
      cy.get('h1').eq(0).should('contain', 'Streamr')
      cy.get('img').eq(2).should('have.attr', 'src', '/static/media/tv.d1669fef910821b06ff5.png')
  })

  it('Should display page name', () => {
      cy.get('.search-title').should('contain', 'Search Results for "spongebob"')
  })

  it('Should display nav bar with logged in user\'s avatar, avatar name, search bar, magnifying glass, "home" link, and "My Watchlist" link', () => {
      cy.get('img').eq(0).should('have.attr', 'src', 'https://cdn-icons-png.flaticon.com/512/3940/3940414.png')
      cy.get('p').eq(0).should('contain', 'snoop_dogg')
      cy.get('.search-input').should('be.visible')
      cy.get('.magnifying-glass-icon').should('be.visible')
      cy.get('p').eq(1).should('contain', 'Home')
      cy.get('p').eq(2).should('contain', 'My Watchlist')
  })
})

describe('Testing Search Page With Show Results', () => {
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
          aliasQuery(req, 'shows')
          req.reply({
              fixture: 'search-view-shows-spongebob.json'
          })
      })
  })
  
  it('Should show 4 Spongebob tv shows after searching for "spongebob" via magnifying glass button', () => {
      cy.get('.search-input').type('spongebob')
      cy.get('.magnifying-glass-icon').click()
      cy.wait('@gqlshowsQuery')

      cy.get('.tile-img').eq(0).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//mgRUpjG9fjMgOmaGeHZR5tzbNYS.jpg')
      cy.get('.bookmark-tile').eq(0).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')

      cy.get('.tile-img').eq(1).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//peZYB3aFOBoZbpFhOZogrTHVlqX.jpg')
      cy.get('.bookmark-tile').eq(1).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')

      cy.get('.tile-img').eq(2).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//fxB8pHdIri8U1pcrEhIV4qh3Etv.jpg')
      cy.get('.bookmark-tile').eq(2).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')

      cy.get('.tile-img').eq(3).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//ge8Vr33fiXgGBLZBGJJYjlFcW46.jpg')
      cy.get('.bookmark-tile').eq(3).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')
  })

  it('Should show 4 Spongebob tv shows after searching for "spongebob" via enter key', () => {
      cy.get('.search-input').type('spongebob{enter}')
      cy.wait('@gqlshowsQuery')

      cy.get('.tile-img').eq(0).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//mgRUpjG9fjMgOmaGeHZR5tzbNYS.jpg')
      cy.get('.bookmark-tile').eq(0).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')

      cy.get('.tile-img').eq(1).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//peZYB3aFOBoZbpFhOZogrTHVlqX.jpg')
      cy.get('.bookmark-tile').eq(1).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')

      cy.get('.tile-img').eq(2).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//fxB8pHdIri8U1pcrEhIV4qh3Etv.jpg')
      cy.get('.bookmark-tile').eq(2).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')

      cy.get('.tile-img').eq(3).should('have.attr', 'src', 'https://image.tmdb.org/t/p/w500//ge8Vr33fiXgGBLZBGJJYjlFcW46.jpg')
      cy.get('.bookmark-tile').eq(3).should('have.attr', 'src', '/static/media/bookmark-false.736e6f0f5d2de776d6d4.png')
  })
})

describe('Testing Search Page With No Show Results', () => {
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
          aliasQuery(req, 'shows')
          req.reply({
              fixture: 'search-view-shows-no-results.json'
          })
      })
  })
  
  it('Should show updated page name and "No results" message" when user searches for "asdf"', () => {
      cy.get('.search-input').type('asdf')
      cy.get('.magnifying-glass-icon').click()
      cy.wait('@gqlshowsQuery')

      cy.get('.search-title').should('contain', 'Search Results for "asdf"')
      cy.get('.shrug-img').should('be.visible')
      cy.get('h2').should('contain', 'No search results')
  })

  it('Should show updated page name and "No results" message" when user searches for "" via magnifying glass button', () => {
      cy.get('.magnifying-glass-icon').click()

      cy.get('.shrug-img').should('be.visible')
      cy.get('h2').should('contain', 'No search results')
  })

  it('Should show updated page name and "No results" message" when user searches for "" via enter key', () => {
      cy.get('.search-input').type('{enter}')

      cy.get('.shrug-img').should('be.visible')
      cy.get('h2').should('contain', 'No search results')
  })

  it('Should show updated page name and "No results" message" when user searches for " " via magnifying glass button', () => {
      cy.get('.magnifying-glass-icon').click()

      cy.get('.shrug-img').should('be.visible')
      cy.get('h2').should('contain', 'No search results')
  })

  it('Should show updated page name and "No results" message" when user searches for " " via enter key', () => {
      cy.get('.search-input').type(' {enter}')

      cy.get('.shrug-img').should('be.visible')
      cy.get('h2').should('contain', 'No search results')
  })
})

describe('Testing Search Page Navigating to Detail View, Home View, and Watch List View', () => {
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
          aliasQuery(req, 'shows')
          req.reply({
              fixture: 'search-view-shows-spongebob.json'
          })
      })
      cy.get('.search-input').type('spongebob')
      cy.get('.magnifying-glass-icon').click()
      cy.wait('@gqlshowsQuery')
  })
  
  it('Should navigate to Detail View if show information is avaiable', () => {
      cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
          aliasQuery(req, 'showDetails')
          req.reply({
              fixture: 'search-view-showDetails-spongebob.json'
          })
      })
      cy.get('.tile-img').eq(1).click()
      cy.wait('@gqlshowDetailsQuery')

      cy.getByData("details-title").should('contain', 'Kamp Koral: SpongeBob\'s Under Years (2021)')
  })

  it('Should navigate to Home View', () => {
      cy.get('p').eq(1).click()
      cy.get('.recommend-title').should('contain', 'Recommended By Friends')
  })

  it('Should navigate to Watch List View', () => {
      cy.get('p').eq(2).click()
      cy.get('.watch-list-title').should('contain', 'My Watch List')
  })
})



describe("Search View (bad response)", () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      switch (req.body.operationName) {
        case "users":
          aliasQuery(req, "users")
          req.reply({ fixture: "login-users.json" })
          break
        case "fetchUser":
          aliasQuery(req, "fetchUser")
          req.reply({ fixture: "home-view-currentUser-recommendations.json" })
          break
        case "shows":
          aliasQuery(req, "shows")
          req.reply({ fixture: "bad-response.json" })
          break
      }
    })
    cy.visit("http://localhost:3000/")
    cy.wait("@gqlusersQuery")
    cy.get("button").click()
    cy.wait("@gqlfetchUserQuery")
    cy.get('.search-input').type('spongebob')
    cy.get('.magnifying-glass-icon').click()
    cy.wait('@gqlshowsQuery')
  })

  it("should display Error view with a bad response", () => {
      it.only("should redirect to Error Component if there is a bad response", () => {
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
})

describe('Testing Home Page with items in Watchlist', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'users')
      req.reply({
        fixture: 'watchlist-users.json'
      })
    })
    cy.visit('http://localhost:3000/')
    cy.wait('@gqlusersQuery')

    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'fetchUser')
      req.reply({
        fixture: 'watchlist-currentUser.json'
      })
    })
    cy.get('button').click()
    cy.wait('@gqlfetchUserQuery')
    cy.get('#watchlist-button > p').click()
  })


  it('Should show Streamr logo in the header', () => {
    cy.get('.logo-section').should('be.visible')
    cy.get('.logo-section > img').should('be.visible')
      .and('have.attr', "src", "/static/media/tv.d1669fef910821b06ff5.png")
    cy.get('.logo-section > h1').should('be.visible')
      .and('contain', 'Streamr')

    cy.get('.navbar-area').should('be.visible')
    cy.get('.user-info > img').should('be.visible')
      .and('have.attr', "src", "https://cdn-icons-png.flaticon.com/512/3940/3940414.png")
    cy.get('.user-info > p').should('be.visible')
      .and('contain', 'snoop_dogg')

    cy.get('.watch-list-title').should('be.visible')
      .and('contain', 'My Watch List')
    cy.get('.watch-list-container')
  })

  it('Should show Navbar with user\'s avatar image, avatar name, search bar, magnifying glass button, and "Home" link', () => {
    cy.get('.navbar-area').should('be.visible')
    cy.get('.user-info > img').should('be.visible')
      .and('have.attr', "src", "https://cdn-icons-png.flaticon.com/512/3940/3940414.png")
    cy.get('.user-info > p').should('be.visible')
      .and('contain', 'snoop_dogg')
    cy.get('.search-bar-and-magnifying-glass-container').should('be.visible')
    cy.get('.search-input').should('be.visible')
    cy.get('.magnifying-glass-icon').should('be.visible')
    cy.get('#home-button > p').should('be.visible')
  })

  it('Should navigate to Search View after entering show title in search bar via clicking magnifying glass', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'shows')
      req.reply({
        fixture: 'watchlist-shows-KingsOfQueens.json'
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
        fixture: 'watchlist-shows-KingsOfQueens.json'
      })
    })
    cy.get('.search-input').type('king of queens{enter}')
    cy.wait('@gqlshowsQuery')
    cy.get('.search-title').should('contain', 'Search Results for "king of queens"')
  })

  it('Should show watchlist page view header and display shows that were added to watchlist', () => {
    cy.get('.watch-list-title').should('be.visible')
      .and('contain', 'My Watch List')
    cy.get('.watch-list-container')

    cy.get('.watch-list-container > :nth-child(2)').should('be.visible')
    cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-clickable-poster > .watch-list-poster-img').should('be.visible')
      .and('have.attr', "src", "https://image.tmdb.org/t/p/w500/5IOj62y2Eb2ngyYmEn1IJ7bFhzH.jpg")
    cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .clickable-title > .title').should('be.visible')
      .and('contain', 'Parks and Recreation (2009)')
    cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .rating-and-genres-container > h2').should('be.visible')
      .and('contain', 'Audience Rating: 8/10')
    cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .rating-and-genres-container > .watch-list-genres').should('be.visible')
      .and('contain', 'Comedy')

    cy.get('.watch-list-container > :nth-child(3)').should('be.visible')
    cy.get(':nth-child(3) > .watch-list-poster-and-info > .watch-list-clickable-poster > .watch-list-poster-img').should('be.visible')
      .and('have.attr', "src", "https://image.tmdb.org/t/p/w500/k3RbNzPEPW0cmkfkn1xVCTk3Qde.jpg")
    cy.get(':nth-child(3) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .clickable-title > .title').should('be.visible')
      .and('contain', '30 Rock (2006)')
    cy.get(':nth-child(3) > .watch-list-poster-and-info > .watch-list-card-info > .rating-and-genres-container > h2').should('be.visible')
      .and('contain', 'Audience Rating: 7.5/10')
    cy.get(':nth-child(3) > .watch-list-poster-and-info > .watch-list-card-info > .rating-and-genres-container > .watch-list-genres').should('be.visible')
      .and('contain', 'Comedy')
  })

  it('Should navigate to Detail View after clicking on show poster', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'showDetails')
      req.reply({
        fixture: 'watchlist-showDetails-30Rock.json'
      })
    })
    cy.get(':nth-child(3) > .watch-list-poster-and-info > .watch-list-clickable-poster > .watch-list-poster-img').click()
    cy.wait('@gqlshowDetailsQuery')
    cy.getByData("details-title").should('contain', '30 Rock (2006)')
  })

  it('Should navigate to Detail View after clicking on show name', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'showDetails')
      req.reply({
        fixture: 'watchlist-showDetails-30Rock.json'
      })
    })
    cy.get(':nth-child(3) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .clickable-title > .title').click()
    cy.wait('@gqlshowDetailsQuery')
    cy.getByData("details-title").should('contain', '30 Rock (2006)')
  })

  it('Should navigate to Recommendation Modal View after clicking on airplane image', () => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'allUsers')
      req.reply({
        fixture: 'watchlist-users.json'
      })
    })
    cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .share-button').should('be.visible')
    cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .share-button > .watch-list-share-icon').should('be.visible')
      .and('have.attr', "src", "/static/media/paper-plane.ab83774b7c046ab2cdc9.png")
    cy.get(':nth-child(2) > .watch-list-poster-and-info > .watch-list-card-info > .watch-list-title-and-share-container > .share-button').click()
    cy.wait('@gqlallUsersQuery')
    cy.get('.modalContainer').should('be.visible')
  })

  it('Should navigate to Home View after clicking on "Home" link', () => {
    cy.get('#home-button > p').click()
    cy.get('.recommend-title').should('contain', 'Recommended By Friends')
  })

})
describe('Testing Home Page with no saved shows in Watchlist', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'users')
      req.reply({
        fixture: 'watchlist-users.json'
      })
    })
    cy.visit('http://localhost:3000/')
    cy.wait('@gqlusersQuery')

    cy.intercept('POST', 'https://streamr-be.herokuapp.com/graphql', (req) => {
      aliasQuery(req, 'fetchUser')
      req.reply({
        fixture: 'watchlist-currentUser-no-watchlist-items.json'
      })
    })
    cy.get('button').click()
    cy.wait('@gqlfetchUserQuery')
    cy.get('#watchlist-button > p').click()

  })

  it('Should show watchlist page view header and display "No saved items" message', () => {
    cy.get('.watch-list-container').should('be.visible')
    cy.get('.shrug-img').should('be.visible')
    cy.get('h2').should('be.visible')
      .and('contain', 'No saved items')

  })
})