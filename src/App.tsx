import './App.css';
import React, { useState } from 'react';
import { useAuth } from './firebase';

import UserInfo from './components/UserInfo';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SignOut from './components/SignOut';
import ChatRoom from './components/ChatRoom';
import WeatherInfo from './components/WeatherInfo';

function App() {
  // Used to toggle the sign in or sign up pages
  const [signIn, setSignIn] = useState<boolean>(true);

  // We can use this custom hook to replace the react-firebase-hooks
  const user = useAuth();

  return (
    <div className='App'>
      <header>
        {user ? <WeatherInfo /> : <h1>💬Chat Room</h1>}
        {user && <UserInfo />}
        <SignOut />
      </header>

      <section className='chat-container'>
        {user ? (
          <ChatRoom />
        ) : signIn ? (
          <SignIn toggleSignIn={() => setSignIn(!signIn)} />
        ) : (
          <SignUp toggleSignIn={() => setSignIn(!signIn)} />
        )}
      </section>
    </div>
  );
}

export default App;
