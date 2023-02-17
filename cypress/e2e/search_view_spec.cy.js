import { aliasQuery } from "../utilities/graphql-test-utils"

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
