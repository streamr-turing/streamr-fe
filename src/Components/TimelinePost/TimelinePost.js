import RecommendeeCard from "../RecommendeeCard/RecommendeeCard"
import RecommendeeIcon from "../RecommendeeIcon/RecommendeeIcon"
import './_TimelinePost.scss'

const TimelinePost = ({ recommenderAvatar, recommenderName, poster, title, releaseYear, rating, genres, date, drawSegment, id }) => {

  return (
    <div className="timeline-post-container">
      <RecommendeeIcon 
        recommenderAvatar={recommenderAvatar} 
        recommenderName={recommenderName} 
      />
      <div className="timeline-segment">
        <div className="timeline-circle"></div>
        {drawSegment ? <div className="timeline-tail"></div> : <div className="timeline-tail-end"></div>}
      </div>
      <RecommendeeCard
        posterUrl={poster}
        title={title}
        releaseYear={releaseYear}
        rating={rating}
        genres={genres}
        date={date}
        tmdbId={id}
        recommenderName={recommenderName}
      />
    </div>
  )
}

export default TimelinePost