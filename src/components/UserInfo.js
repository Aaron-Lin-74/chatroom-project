import React, { useState, useRef } from 'react'
import { auth, updateProfile } from '../firebase'
import { FaTimes } from 'react-icons/fa'

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'

function UserInfo() {
  const user = auth.currentUser
  let isHidden = !user
  const profile = useRef(null)
  const userNameRef = useRef('')
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState(user.displayName)

  // Triggered when a image is selected via the media picker.
  function onMediaFileSelected(e) {
    e.preventDefault()
    const photo = e.target.files[0]
    // Check if the file is an image.
    if (!photo.type.match('image.*')) {
      alert('You can only upload image for profile')
      return
    }
    // Check if the user is signed-in
    if (user !== null) {
      setPhoto(photo)
    }
  }

  const update = async () => {
    // Use the input's name attribute to get its value
    const newUserName = userNameRef.current.value
    if (user !== null) {
      try {
        // show the loading image
        setLoading(true)
        if (photo !== null) {
          // upload the image to Cloud Storage and generate a public URL for photoURL
          const photoPath = `${user.uid}/profile/${photo.name}`
          const newImageRef = ref(getStorage(), photoPath)
          await uploadBytesResumable(newImageRef, photo)
          const publicImageUrl = await getDownloadURL(newImageRef)
          await updateProfile(user, {
            displayName: userName,
            photoURL: publicImageUrl,
          })
          setUserName(newUserName)
        } else {
          await updateProfile(user, {
            displayName: userName,
          })
          setUserName(newUserName)
        }
        closeProfile()
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    return false
  }

  const showProfile = () => {
    profile.current.style.display = 'block'
  }

  const closeProfile = () => {
    profile.current.style.display = 'none'
  }

  return (
    <div className='user-info' hidden={isHidden}>
      <img
        className='profilePhoto'
        src={user.photoURL || '/images/default_profile.jpg'}
        referrerPolicy='no-referrer'
        alt='profile'
        onClick={showProfile}
      />
      <h1>{userName}</h1>
      <div id='update-profile-container' ref={profile}>
        <h2>Update your profile</h2>
        {loading && (
          <div className='loading-container'>
            <img src='https://www.google.com/images/spin-32.gif?a' />
          </div>
        )}
        <form className='update-profile-form'>
          <FaTimes onClick={closeProfile} id='update-profile-close' />
          <label htmlFor='displayName'>New Username</label>
          <input
            id='displayName'
            name='displayName'
            type='text'
            ref={userNameRef}
          />
          <label htmlFor='profile-Photo' id='profile-label'>
            New Profile Photo
          </label>
          <input
            id='profile-Photo'
            name='profilePhoto'
            type='file'
            accept='image/*'
            onChange={onMediaFileSelected}
          />
          <button className='chat-btns' type='button' onClick={update}>
            Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserInfo
