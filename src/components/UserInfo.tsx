import React, { useState, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { auth, updateProfile, getMessagesAndUpdatePhoto } from '../firebase';

function UserInfo() {
  const user = auth.currentUser!;
  const isHidden = !user;
  const displayName: string = user.displayName!;
  const profile = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>(displayName);
  const [userNameForm, setUserNameForm] = useState<string>(displayName);

  /** Set the profile photo to the selected image. */
  function onMediaFileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const photoFile = e.target.files[0];
      // Check if the file is an image.
      if (!photoFile.type.match('image.*')) {
        // eslint-disable-next-line no-alert
        alert('You can only upload image for profile');
        return;
      }
      // Check if the user is signed-in
      if (user !== null) {
        setPhoto(photoFile);
      }
    }
  }
  const closeProfile = () => {
    if (profile.current !== null) {
      profile.current.style.display = 'none';
    }
  };

  /**
   * Update the profile details, like displayName and photoURL.
   */
  const update = async () => {
    // Use the input's name attribute to get its value
    if (user !== null) {
      try {
        // show the loading image
        setLoading(true);
        if (photo !== null) {
          // upload the image to Cloud Storage and generate a public URL for photoURL
          const photoPath = `${user.uid}/profile/${photo.name}`;
          const newImageRef = ref(getStorage(), photoPath);
          await uploadBytesResumable(newImageRef, photo);
          const publicImageUrl = await getDownloadURL(newImageRef);
          await updateProfile(user, {
            displayName: userName,
            photoURL: publicImageUrl,
          });
          setUserName(userNameForm);
          // also update all the previous message sent by current user
          await getMessagesAndUpdatePhoto(user.uid, publicImageUrl);
        } else {
          await updateProfile(user, {
            displayName: userName,
          });
          setUserName(userNameForm);
        }
        closeProfile();
      } catch (err) {
        console.error(err);
      } finally {
        setPhoto(null);
        setLoading(false);
      }
    }
    return false;
  };

  const showProfile = () => {
    if (profile.current !== null) {
      profile.current.style.display = 'block';
    }
  };

  return (
    <div className='user-info' hidden={isHidden}>
      <div
        onClick={showProfile}
        onKeyDown={showProfile}
        role='button'
        tabIndex={0}
      >
        <img
          className='profilePhoto'
          src={user?.photoURL || '/images/default_profile.jpg'}
          referrerPolicy='no-referrer'
          alt='profile'
        />
      </div>
      <h1>{userName}</h1>
      <div id='update-profile-container' ref={profile}>
        <h2>Update your profile</h2>
        {loading && (
          <div className='loading-container'>
            <img
              src='https://www.google.com/images/spin-32.gif?a'
              alt='loading'
            />
          </div>
        )}
        <form className='update-profile-form'>
          <FaTimes onClick={closeProfile} id='update-profile-close' />
          <label htmlFor='displayName'>
            New Username
            <input
              id='displayName'
              name='displayName'
              type='text'
              value={userNameForm}
              onChange={(e) => setUserNameForm(e.target.value)}
            />
          </label>
          <label htmlFor='profile-Photo' id='profile-label'>
            New Profile Photo
            <input
              id='profile-Photo'
              name='profilePhoto'
              type='file'
              accept='image/*'
              onChange={onMediaFileSelected}
            />
          </label>
          <button
            className='chat-btns'
            type='button'
            title='Update the profile'
            onClick={update}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
