import UserTypes from "./UserTypes"

export const USER_INTIAL_STATE = {
    currentUser: {
        "id": 2,
        "username": "Hank",
        "avatarUrl": "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_3x2.jpg",
        "watchlist": [
            {
                "tmbdId": 10,
                "title": "Best dang show",
                "releaseYear": 2022,
                "thumbnailUrl": "https://media.gq.com/photos/5df5a3794e7a380009b83bbd/16:9/w_2560%2Cc_limit/BestShows.jpg"
            }
        ],
        "recommendations": [
            {
                "id": 10,
                "recommendeeId": 3,
                "recommender": {
                    "id": 5,
                    "username": "Hanke",
                    "avatarUrl": "https://cdn-icons-png.flaticon.com/512/3940/3940412.png"
                },
                "show": {
                    "tmbdId": 10,
                    "title": "Best dang show",
                    "releaseYear": 2022,
                    "rating": 8,
                    "genres": [
                        "Dramady",
                        "Indie",
                        "Family"
                    ],
                    "thumbnailUrl": "https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/268821/4556789/apiihy1mm__31528.1625622408.jpg?c=2"
                },
                "createdAt": "2023-02-01T22:20:58Z"
            },
            {
                "id": 11,
                "recommendeeId": 4,
                "recommender": {
                    "id": 6,
                    "username": "Harkey",
                    "avatarUrl": "https://cdn-icons-png.flaticon.com/512/3940/3940403.png"
                },
                "show": {
                    "tmbdId": 11,
                    "title": "GhostBusters",
                    "releaseYear": 1980,
                    "rating": 9,
                    "genres": [
                        "Comedy",
                        "Sci-fi"
                    ],
                    "thumbnailUrl": "https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/268821/4556789/apiihy1mm__31528.1625622408.jpg?c=2"
                },
                "createdAt": "2022-12-10T22:20:58Z"
            },
            {
                "id": 12,
                "recommendeeId": 5,
                "recommender": {
                    "id": 7,
                    "username": "Hoppy",
                    "avatarUrl": "https://cdn-icons-png.flaticon.com/512/3940/3940405.png"
                },
                "show": {
                    "tmbdId": 12,
                    "title": "Jaws",
                    "releaseYear": 1979,
                    "rating": 6,
                    "genres": [
                        "Horror",
                        "Suspense"
                    ],
                    "thumbnailUrl": "https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/268821/4556789/apiihy1mm__31528.1625622408.jpg?c=2"
                },
                "createdAt": "2023-09-02T22:20:58Z"
            }
        ]
    }
}

const userReducer = (state, action) => {
    switch(action.type) {
        case UserTypes.ADD_TO_WATCHLIST:
            return {
                currentUser: {
                    ...state.currentUser,
                    watchlist: [
                        ...state.currentUser.watchlist,
                        action.payload
                    ]
                }
            }
        case UserTypes.REMOVE_FROM_WATCHLIST:
            const filteredList = state.currentUser.watchlist.filter(show => {
                return show.tmbdId !== action.payload
            })
            return {
                currentUser: {
                    ...state.currentUser,
                    watchlist: filteredList
                }
            }
        default:
            return state
    }
}

export default userReducer