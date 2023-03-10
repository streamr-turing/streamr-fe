import { useEffect, useContext } from "react"
import useWatchlist from "../../Hooks/useWatchlist"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from '@apollo/client'

import { GET_SHOW_DETAILS } from '../../GraphQL/Queries'
import { UserContext } from "../../Providers/UserContext"

import './_DetailsPage.scss'
import DetailsTable from "./DetailsTable"
import DetailsReccInterface from "./DetailsReccInterface"

import savedTrue from "../../images/bookmark-true.png"
import savedFalse from "../../images/bookmark-false.png"

import Loading from "../Loading/Loading"

const DetailsPage = () => {
  const [
    watchlistId,
    findWatchlistId,
    handleSaveShow,
    handleRemoveShow
  ] = useWatchlist(null)

  const { currentUser } = useContext(UserContext)
  const { showId } = useParams()
  const navigate = useNavigate()

  const { error, loading, data } = useQuery(
    GET_SHOW_DETAILS, {
    variables: {
      tmdbId: parseInt(showId),
      userId: parseInt(currentUser.id),
      mediaType: "tv"
    }
  })

  useEffect(() => {
    if (data) findWatchlistId(data.showDetails.tmdbId)
  }, [data])

  const toggleSaved = () => {
    if (!watchlistId) handleSaveShow(data.showDetails)
    else handleRemoveShow(watchlistId)
  }

  if (loading) return <Loading />
  if (error) {
    navigate("/error", { replace: true })
    return
  }

  const { genres, posterUrl, rating, releaseYear, streamingService, summary, title, recommendedBy } = data?.showDetails
  return (
    <>
      <section className="details-parent">
        <div className="details">
          <div className="details__lower">
            <div className="details__lower__left">
              <h1 
                className="details__title"
                data-cy="details-title">{`${title} (${releaseYear})`}</h1>
              <img
                className="details__lower__left__bookmark"
                src={watchlistId ? savedTrue : savedFalse}
                alt="bookmark icon"
                role="button"
                aria-label="toggle saved to watchlist"
                aria-pressed={watchlistId}
                onClick={toggleSaved}
                tabIndex={0}
                data-cy="bookmark"
              />
              <img
                className="details__lower__left__poster"
                src={posterUrl}
                alt={`Poster for ${title}`}
                data-cy="poster"
              />
            </div>
            <div className="details__lower__right">
              <div>
                <DetailsTable
                  data={{
                    streamingService,
                    genres,
                    rating,
                    summary
                  }}
                />
                <p data-cy="summary">{summary}</p>
              </div>
              <DetailsReccInterface 
                id={parseInt(showId)} 
                recommenders={recommendedBy} 
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DetailsPage