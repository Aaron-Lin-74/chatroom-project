import './App.css';
import React, { useState } from 'react';
import { useAuth, signOutUser } from './firebase';

import UserInfo from './components/UserInfo';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SignOut from './components/SignOut';
import ChatRoom from './components/ChatRoom';
import WeatherInfo from './components/WeatherInfo';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Used to toggle the sign in or sign up pages
  const [signIn, setSignIn] = useState<boolean>(true);

  // We can use this custom hook to replace the react-firebase-hooks
  const user = useAuth();

  return (
    <div className='App'>
      <ErrorBoundary>
        <header>
          {user ? <WeatherInfo /> : <h1>💬Chat Room</h1>}
          {user && <UserInfo />}
          {user && <SignOut signOutUser={signOutUser} />}
        </header>

        <section className='chat-container'>
          {user && <ChatRoom />}
          {!user &&
            (signIn ? (
              <SignIn toggleSignIn={() => setSignIn(!signIn)} />
            ) : (
              <SignUp toggleSignIn={() => setSignIn(!signIn)} />
            ))}
        </section>
      </ErrorBoundary>
    </div>
  );
}

export default App;
