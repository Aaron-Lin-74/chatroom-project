import React, { useState } from 'react'
import { auth, signInWithEmailAndPassword, signInWithGoogle } from '../firebase'

function SignIn({ toggleSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const signInWithEmail = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
        setTimeout(() => setError(''), 3000)
      })
  }
  return (
    <div className='signIn-container'>
      {error && (
        <div className='error-container'>
          <p>{error}</p>
        </div>
      )}
      <form className='signIn-form' onSubmit={signInWithEmail}>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          placeholder='example@example.com'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit' className='chat-btns sign-in'>
          Sign In
        </button>

        <p>
          Do not have an account? You can{' '}
          <a className='toggle-link' onClick={toggleSignIn}>
            sign up
          </a>{' '}
          with email & password, or use Google Account to sign in.
        </p>

        <button className='sign-in chat-btns' onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <p>Welcome to the Chat room, please don't use any abused words.</p>
      </form>
    </div>
  )
}

export default SignIn
