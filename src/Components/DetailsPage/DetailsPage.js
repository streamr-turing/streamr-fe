import { useEffect, useContext } from "react"
import useWatchlist from "../../Hooks/useWatchlist"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from '@apollo/client'

import { GET_SHOW_DETAILS } from '../../GraphQL/Queries'
import { ADD_TO_WATCHLIST, REMOVE_FROM_WATCHLIST } from "../../GraphQL/Mutations"
import { UserContext } from "../../Providers/UserContext"

import './_DetailsPage.scss'
import DetailsTable from "./DetailsTable"
import DetailsReccInterface from "./DetailsReccInterface"

import savedTrue from "../../images/bookmark-true.png"
import savedFalse from "../../images/bookmark-false.png"

const DetailsPage = () => {
  const [
    watchlistId, 
    setWatchlistId, 
    findWatchlistId,
    saveError,
    removeError,
    handleSaveShow,
    handleRemoveShow
  ] = useWatchlist(null)

  const { showId } = useParams()
  const navigate = useNavigate()

  const { 
    currentUser, 
    addToWatchList, 
    removeFromWatchList 
  } = useContext(UserContext)

  const [saveShowServer] = useMutation(ADD_TO_WATCHLIST)
  const [removeShowServer, removeShowResponse] = useMutation(REMOVE_FROM_WATCHLIST)

  const { error, loading, data } = useQuery(
    GET_SHOW_DETAILS, {
      variables: {
        tmdbId: parseInt(showId),
        userId: parseInt(currentUser.id),
        mediaType: "tv"
      }
    }
  )

  useEffect(() => {
    if (data) findWatchlistId(data.showDetails.tmdbId)
  }, [data])

  const toggleSaved = () => {
    if (!watchlistId) {
      handleSaveShow(currentUser.id, data.showDetails)
    } else {
      handleRemoveShow(watchlistId)
      setWatchlistId(null)
    }
  }

  // const handleSaveShow = async () => {
  //   const { data, error } = await saveShowServer({
  //     variables: {
  //       tmdbId: parseInt(showId),
  //       userId: parseInt(currentUser.id),
  //       mediaType: "tv"
  //   }})
  //   // add error handling for failing to add to watchlist
  //   const currentShow = {
  //     "id": parseInt(data.createWatchlistItem.id),
  //     "show": {
  //       "tmdbId": parseInt(showId),
  //       "title": title,
  //       "releaseYear": releaseYear,
  //       "posterUrl": posterUrl,
  //       "mediaType": "tv",
  //       "genres": genres,
  //       "rating": rating
  //     }
  //   }
  //   addToWatchList(currentShow)
  //   setWatchlistId(parseInt(data.createWatchlistItem.id))
  // }

  // const handleRemoveShow = async () => {
  //   const { error } = await removeShowServer({ variables: { id: watchlistId }})
  //   // add error handling for failing to remove from watchlist
  //   removeFromWatchList(parseInt(showId))
  //   setWatchlistId(null)
  // }

  if (loading) return <p>Loading...</p>
  if (error) navigate("/error", { replace: true }) 

  const { genres, posterUrl, rating, releaseYear, streamingService, summary, title } = data.showDetails

  return (
    <>
      { data &&
        <section className="details-parent">
          <div className="details">
            <div className="details__lower">
              <div className="details__lower__left">
                <h1 className="details__title">{`${title} (${releaseYear})`}</h1>
                <img 
                  data-cy="bookmark" 
                  className="details__lower__left__bookmark" 
                  src={watchlistId ? savedTrue : savedFalse} 
                  alt="bookmark icon"
                  role="button"
                  aria-label="toggle saved to watchlist"
                  aria-pressed={watchlistId}
                  onClick={toggleSaved}
                  tabIndex={0}
                />
                <img
                  data-cy="poster"
                  className="details__lower__left__poster" 
                  src={posterUrl} 
                  alt={`Poster for ${title}`}
                />
              </div>
              <div className="details__lower__right">
                <div>
                  <DetailsTable data={{
                    streamingService,
                    genres,
                    rating
                  }}/>
                  <p>{summary}</p>
                </div>
                <DetailsReccInterface id={showId} />
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default DetailsPage