import { Link } from 'react-router-dom'

import './_PageNotFound.scss'

const PageNotFound = () => {

    return (
        <div className='page-not-found'>
            <h1>404</h1>
            <h1>Page Not Found.</h1>
            <h2>Ooops! The page you requested could not be found. Please go back to the home page.</h2>
            <Link className="go-home-button" to="/">
                Go Home
            </Link>
        </div>
    )
}

export default PageNotFound