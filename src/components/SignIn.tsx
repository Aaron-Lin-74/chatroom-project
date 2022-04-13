import { Auth, UserCredential } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../firebase';

interface Props {
  toggleSignIn: () => void;
  signInWithEmailAndPassword(
    auth: Auth,
    email: string,
    password: string
  ): Promise<UserCredential>;
  signInWithGoogle: () => Promise<void>;
}
function SignIn({
  toggleSignIn,
  signInWithEmailAndPassword,
  signInWithGoogle,
}: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // If there exits error, disappear the error message in 3s.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (error) {
      timer = setTimeout(() => setError(''), 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  const signInWithEmail = (e: React.FormEvent): void => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    });
  };

  return (
    <div className='signIn-container'>
      {error && (
        <div className='error-container'>
          <p role='alert'>{error}</p>
        </div>
      )}
      <form className='signIn-form' onSubmit={signInWithEmail}>
        <label htmlFor='email'>
          Email
          <input
            id='email'
            type='email'
            placeholder='example@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type='submit' className='chat-btns sign-in'>
          Sign In
        </button>
      </form>
      <button
        className='sign-in chat-btns'
        onClick={signInWithGoogle}
        type='button'
      >
        <FcGoogle />
        Sign in with Google
      </button>
      <p className='sign-in-text'>
        Do not have an account? You can{' '}
        <span
          className='toggle-link'
          onClick={toggleSignIn}
          onKeyDown={toggleSignIn}
          tabIndex={0}
          role='button'
        >
          sign up
        </span>{' '}
        with email & password, or use Google Account to sign in.
      </p>
    </div>
  );
}

export default SignIn;
