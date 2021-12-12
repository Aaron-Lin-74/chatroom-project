import React, { useState } from 'react'
import {
  signInWithGoogle,
  auth,
  createUserWithEmailAndPassword,
} from '../firebase'
import { FcGoogle } from 'react-icons/fc'

function SignUp({ toggleSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')

  const signUpWithEmail = async (e) => {
    e.preventDefault()
    try {
      // validation
      if (password !== password2) {
        setError('The passwords do not match!')
        return
      }
      if (password.length < 6) {
        setError('The password should be at least 6 characters')
        return
      }

      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.log(err)
      setError(err.message)
    } finally {
      setTimeout(() => setError(''), 3000)
    }
  }
  return (
    <div className='signIn-container'>
      {error && (
        <div className='error-container'>
          <p>{error}</p>
        </div>
      )}
      <form className='signIn-form' onSubmit={signUpWithEmail}>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          placeholder='example@example.com'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor='password'>Password (at least 6 characters)</label>
        <input
          id='password'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor='password2'>Confirm Password</label>
        <input
          id='password2'
          type='password'
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <button type='submit' className='chat-btns sign-up'>
          Sign Up
        </button>

        <button
          type='button'
          className='sign-in chat-btns'
          onClick={signInWithGoogle}
        >
          <FcGoogle />
          Sign up with Google
        </button>
        <p>
          Already have an account? You can{' '}
          <span className='toggle-link' onClick={toggleSignIn}>
            sign in
          </span>{' '}
          with email & password, or use Google Account to sign in.
        </p>
      </form>
    </div>
  )
}

export default SignUp
