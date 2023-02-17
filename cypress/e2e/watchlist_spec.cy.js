import { aliasQuery } from "../utilities/graphql-test-utils"

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