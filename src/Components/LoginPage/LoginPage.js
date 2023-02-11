
import './_LoginPage.scss'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_ALL_USERS } from '../../GraphQL/Queries'
import tv from '../../images/tv.png'

import useLoginUser from '../../Hooks/useLoginUser'

const LoginPage = () => {
  const { error, loading, data } = useQuery(GET_ALL_USERS)
  const [allUsers, setAllUsers] = useState([])
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
    validSignIn: true,
    loggedIn: false,
  })

  const handleChange = (event) => {
    setSignInData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  useEffect(() => {
    if(data) {
      console.log('data', data.users)
      setAllUsers(data.users)
    }
  }, [data])
  
  const handleSubmit = (event) => {
    event.preventDefault()
    const userFound = allUsers.find(user => user.username === signInData.username)

    if(userFound && signInData.password === 'streamr' ) {
      setSignInData((prevState) => ({
        ...prevState,
        validSignIn: true,
        loggedIn: true
      }))

    } else {
      setSignInData((prevState) => ({
        ...prevState,
        validSignIn: false,
        loggedIn: false
      }))
      clearLogin()
    }
  }

  const clearLogin = () => {
    setSignInData({
      ...signInData,
      username: '',
      password: '',
      validSignIn: false
    })
  }

  return (
    <div className="login-background">
      <div className="login-area">
        <section className="logo-section">
          <img src={tv} alt='Drawing of a TV' />
          <h1>Streamr</h1>
        </section>
        <form className="username-password">
        <input
          type='text'
          placeholder='Username'
          name='username'
          value={signInData.username}
          onChange={handleChange}
          className="input"
        />
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={signInData.password}
          onChange={handleChange}
          className="input"
        />
        <button onClick={event => handleSubmit(event)}>Login</button>
        </form>
        {signInData.loggedIn &&
          <Navigate to='/' />
        }
        {!signInData.validSignIn && 
        <p>Sorry, the username/password is incorrect. Please try again.</p>
        }
      </div>
    </div>
  )
}

export default LoginPage