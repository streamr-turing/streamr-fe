import './_NoRecommendations.scss'
import television from "../../images/television.png"

const NoRecommendations = () => {

    return (
        <div className='no-recommendations-container'>
            <img src={television} className='shrug-img'/>
            <h2>No recommendations today. Try again later</h2>
        </div>
    )
}

export default NoRecommendations