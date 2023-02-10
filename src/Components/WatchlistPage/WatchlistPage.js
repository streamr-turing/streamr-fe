import { useContext } from 'react'
import { UserContext } from '../../Providers/UserContext'
import WatchListItem from '../WatchListItem/WatchListItem'
// import NoRecommendations from '../NoRecommendations/NoRecommendations'

// import TimelinePost from "../TimelinePost/TimelinePost"
import "./_WatchListPage.scss"

const WatchListPage = () => {
  const { currentUser } = useContext(UserContext)
  console.log("HERE: ", currentUser.watchlist)

  const watchListResult = () => {
    const watchList = currentUser.watchlist.map(savedItem => {
      return (
          <WatchListItem
            poster={savedItem.thumbnailUrl}
            title={savedItem.title}
            releaseYear={savedItem.releaseYear}
            rating={savedItem.rating}
            key={savedItem.tmdbId}
            genres={savedItem.genres}
          />
      )
    })
    return watchList

    // if (currentUser.recommendations.length) {
    //   const sortedList = currentUser.recommendations.sort((a, b) => {
    //     a = a.createdAt.slice(0, 10).split('-').join('')
    //     b = b.createdAt.slice(0, 10).split('-').join('')
    //     return b - a
    //   })
    // const timelinePost = sortedList.map(recommendation => {
    //   return (
    //     <TimelinePost
    //       recommenderAvatar={recommendation.recommender.avatarUrl}
    //       recommenderName={recommendation.recommender.username}
    //       poster={recommendation.show.thumbnailUrl}
    //       title={recommendation.show.title}
    //       releaseYear={recommendation.show.releaseYear}
    //       rating={recommendation.show.rating}
    //       genres={recommendation.show.genres}
    //       date={recommendation.createdAt}
    //       key={recommendation.id}
    //     />
    //   )
    // })
    // return (
    //   <div className='timeline-container'>
    //       {timelinePost}
    //       <h3>End of feed</h3>
    //     </div>
    //   )
    // }
    // else {
    //   return <NoRecommendations />
    // }
  }


  return (
    <div className="watch-list-container">
      <h1 className="watch-list-title">My Watch List</h1>
      {watchListResult()}
    </div>
  )
}

export default WatchListPage