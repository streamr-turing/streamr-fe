import { aliasQuery } from "../utilities/graphql-test-utils"

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