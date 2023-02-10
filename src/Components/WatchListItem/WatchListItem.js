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

    // const allGenres = genres.reduce((genreCategories, currentGenre) => {
    //     genreCategories += currentGenre
    //     if (currentGenre !== genres[genres.length - 1]) {
    //         genreCategories += " - "
    //     }
    //     return genreCategories
    // }, "")

    // const formatDate = () => {
    //     date = date.slice(0, 10).split('-')
    //     let day = parseInt(date[2])
    //     let month = parseInt(date[1])
    //     let year = date[0]
    //     switch (month) {
    //         case 1: month = "Jan"; break;
    //         case 2: month = "Feb"; break;
    //         case 3: month = "Mar"; break;
    //         case 4: month = "Apr"; break;
    //         case 5: month = "May"; break;
    //         case 6: month = "Jun"; break;
    //         case 7: month = "Jul"; break;
    //         case 8: month = "Aug"; break;
    //         case 9: month = "Sep"; break;
    //         case 10: month = "Oct"; break;
    //         case 11: month = "Nov"; break;
    //         case 12: month = "Dec"; break;
    //     }
    //     date = `${month} ${day} ${year}`
    //     return date
    // }

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
                <img src={poster} className='watch-list-poster-img' />
                <div className='watch-list-card-info'>
                    <div className="watch-list-title-and-share-container">
                        <h1>{title} ({releaseYear})</h1>
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
            {/* <div className="recommendee-card-container">
                <img src={isSaved ? savedTrue : savedFalse} className='home-bookmark' onClick={toggleSaved}/>
                <Link to='/show/3' className='clickable-poster'><img src={poster} className='poster-img' /></Link>
                <div className='recommendee-card-info'>
                    <NavLink to='/show/3' className='clickable-title'><h1 className='title'>{title} ({releaseYear})</h1></NavLink>
                    <h2 className='audience-rating'>Audience Rating: {rating}/10</h2>
                    <h3>{allGenres}</h3>
                </div>
            </div>
            <h4 className='post-date'>{formatDate()}</h4> */}
        </div>
    )
}

export default WatchListItem