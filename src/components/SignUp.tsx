import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Auth, UserCredential } from 'firebase/auth';
import { auth } from '../firebase';

interface Props {
  toggleSignIn: () => void;
  signInWithGoogle: () => Promise<void>;
  createUserWithEmailAndPassword(
    auth: Auth,
    email: string,
    password: string
  ): Promise<UserCredential>;
}
function SignUp({
  toggleSignIn,
  signInWithGoogle,
  createUserWithEmailAndPassword,
}: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
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
  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // validation
      if (password !== password2) {
        setError('The passwords do not match!');
        return;
      }
      if (password.length < 6) {
        setError('The password should be at least 6 characters');
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };
  return (
    <div className='signIn-container'>
      {error && (
        <div className='error-container'>
          <p role='alert'>{error}</p>
        </div>
      )}
      <form className='signIn-form' onSubmit={signUpWithEmail}>
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
          Password (at least 6 characters)
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label htmlFor='password2'>
          Confirm Password
          <input
            id='password2'
            type='password'
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </label>
        <button type='submit' className='chat-btns sign-up'>
          Sign Up
        </button>
      </form>
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
        <span
          className='toggle-link'
          onClick={toggleSignIn}
          onKeyDown={toggleSignIn}
          role='button'
          tabIndex={0}
        >
          sign in
        </span>
        with email & password, or use Google Account to sign in.
      </p>
    </div>
  );
}

export default SignUp;
