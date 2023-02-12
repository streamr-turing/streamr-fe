import './_RecModal.scss'
import { useContext, useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { RecModalContext } from "../../Providers/RecModalContext"
import { UserContext } from '../../Providers/UserContext'
import Error from '../Error/Error'

import Friend from './Friend/Friend'
import { useQuery, useMutation } from '@apollo/client'

import { GET_ALL_USERS } from '../../GraphQL/Queries'
import { SEND_RECOMMENDATION } from '../../GraphQL/Mutations'

import Loading from '../Loading/Loading'

const RecModal = () => {
    const  { changeModalState, changeModalShow, currentModal } = useContext(RecModalContext)
    const { currentUser } = useContext(UserContext)
    const [sendList, setSendList] = useState([])
    const [allFriendsList, setAllFriendsList] = useState([])
    const [createRecommendation] = useMutation(SEND_RECOMMENDATION)
    const { error, loading, data } = useQuery(GET_ALL_USERS, {fetchPolicy: 'network-only'})
    const navigate = useNavigate()

    useEffect(() => {
        if(data) {
            const getFriendsList = () => {
                return data.users.filter(user => user.id !== currentUser.id)
            }
            
            setAllFriendsList(getFriendsList())

        }
 
    }, [data])


    const friendList = allFriendsList.map(friend => {
        return(
            <Friend
            key={friend.id}
            userid={friend.id}
            username={friend.username}
            sendList={sendList}
            setSendList={setSendList}
            />
        )
    })

    const closeModal = () => {
        changeModalState(false)
        changeModalShow(0)
      }
    
    const handleSend = (event) => {
        event.preventDefault()
        const recommendedPostList = sendList.map(friendId => 
            ( {
                tmdbId: currentModal.tmdbId,
                recommenderId: +currentUser.id,
                recommendeeId: +friendId,
                mediaType: "tv"
            })
        )
            recommendedPostList.forEach(recommendation => {
                createRecommendation({ variables: recommendation})
            })
        closeModal()
    }

    if (loading) return <Loading/>
    if (error) {
      console.log(error)
      navigate("/error", { replace: true }) 
    }

    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <button className='titleCloseBtn' onClick={()=> {
            closeModal()
          }}> X </button>
                 {data ?
                    <form className="body">
                        <section className="friend-list">
                        { friendList.length ? friendList: <p>Add some friends!</p> }
                        </section>
                        <button onClick={handleSend}>Send!</button>
                    </form>
                    : <Error />
                }
            </div>
        </div>
    )
}


export default RecModal