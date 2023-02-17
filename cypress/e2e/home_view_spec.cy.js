import { aliasQuery } from "../utilities/graphql-test-utils"

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