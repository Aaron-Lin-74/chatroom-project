import './App.css'
import React, { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, useAuth } from './firebase'

import UserInfo from './components/UserInfo'
import SignIn from './components/SignIn'
import SignOut from './components/SignOut'
import ChatRoom from './components/ChatRoom'

function App() {
  // const [loading, setLoading] = useState(false)
  // const [user, loading, error] = useAuthState(auth)
  // useEffect(() => {
  // }, [user, loading])

  // We can use this custom hook to replace the react-firebase-hooks
  const user = useAuth()
  return (
    <div className='App'>
      <header>
        <h1>💬Chat Room</h1>
        {user && <UserInfo />}
        {console.log(user)}
        <SignOut />
      </header>

      <section className='chat-container'>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
}

export default App
