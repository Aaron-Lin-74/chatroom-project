import React from 'react'
import { auth } from '../firebase'

function UserInfo() {
  let isHidden = !auth.currentUser
  return (
    <div className='user-info' hidden={isHidden}>
      <img
        className='profilePhoto'
        src={auth.currentUser.photoURL}
        referrerPolicy='no-referrer'
        alt='profile'
      />
      <h1>{auth.currentUser.displayName}</h1>
    </div>
  )
}

export default UserInfo
