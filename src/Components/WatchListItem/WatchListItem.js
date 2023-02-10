import { useState } from "react"
import { NavLink, Link } from "react-router-dom"

import shareIcon from "../../images/paper-plane.png"
import savedTrue from "../../images/bookmark-true.png"
import savedFalse from "../../images/bookmark-false.png"
import './_WatchListItem.scss'

const WatchListItem = ({ poster, title, releaseYear, rating, genres }) => {
    const [isSaved, setIsSaved] = useState(true)

    const toggleSaved = () => {
        if (!isSaved) {
            setIsSaved(true)
        }
        else {
            setIsSaved(false)
        }
    }

    const allGenres = genres.reduce((genreCategories, currentGenre) => {
        genreCategories += currentGenre
        if (currentGenre !== genres[genres.length - 1]) {
            genreCategories += " - "
        }
        return genreCategories
    }, "")

    return (
        <div className="watch-list-card-container">
            <div className="watch-list-poster-and-info">
                <img src={isSaved ? savedTrue : savedFalse} className='watch-list-bookmark' onClick={toggleSaved} />
                <Link to='/show/3' className='watch-list-clickable-poster'><img src={poster} className='watch-list-poster-img' /></Link>
                <div className='watch-list-card-info'>
                    <div className="watch-list-title-and-share-container">
                        <NavLink to='/show/3' className='clickable-title'><h1 className='title'>{title} ({releaseYear})</h1></NavLink>
                        <div className="share-button">
                            <img src={shareIcon} className="watch-list-share-icon" />
                        </div>
                    </div>
                    <div className="rating-and-genres-container">
                        <h2>Audience Rating: {rating}/10</h2>
                        <h3 className="watch-list-genres">{allGenres}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WatchListItem