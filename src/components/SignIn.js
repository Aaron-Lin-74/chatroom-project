import React from 'react'
import { signInWithGoogle } from '../firebase'

function SignIn() {
  return (
    <>
      <button className='sign-in' onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>Welcome to the Chat room, please don't use any abused words.</p>
    </>
  )
}

export default SignIn
