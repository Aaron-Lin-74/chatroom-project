import React, { useState } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from '../firebase';
import { FcGoogle } from 'react-icons/fc';

function SignIn({ toggleSignIn }: { toggleSignIn: () => void }) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const signInWithEmail = (e: React.FormEvent): void => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setTimeout(() => setError(''), 3000);
    });
  };
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
      </form>
      <button className='sign-in chat-btns' onClick={signInWithGoogle}>
        <FcGoogle />
        Sign in with Google
      </button>
      <p className='sign-in-text'>
        Do not have an account? You can{' '}
        <span className='toggle-link' onClick={toggleSignIn}>
          sign up
        </span>{' '}
        with email & password, or use Google Account to sign in.
      </p>
    </div>
  );
}

export default SignIn;
