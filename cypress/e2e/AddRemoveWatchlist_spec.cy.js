import { aliasQuery } from "../utilities/graphql-test-utils"

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