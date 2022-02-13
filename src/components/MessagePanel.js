import React, { useState } from 'react'
import { auth, messagesRef } from '../firebase'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md'
import { BsEmojiSmile } from 'react-icons/bs'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, updateDoc, Timestamp } from 'firebase/firestore'

function MessagePanel() {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser
    setMessage('')
    try {
      await addDoc(messagesRef, {
        text: message,
        uid,
        createdAt: Timestamp.now(),
        // * serverTimestamp has the delay, Timestamp.now() is a better choice
        // createdAt: serverTimestamp(),
        photoURL,
      })
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error)
    }
  }

  // Triggered when a file is selected via the media picker.
  function onMediaFileSelected(e) {
    e.preventDefault()
    const file = e.target.files[0]
    // Check if the file is an image.
    if (!file.type.match('image.*')) {
      alert('You can only share images')
      return
    }
    // Check if the user is signed-in
    if (auth.currentUser) {
      saveImageMessage(file)
    }
  }

  const clickFileInput = () => {
    // Since we hide the file input, we click the button to click it instead
    document.getElementById('mediaCapture').click()
  }

  const saveImageMessage = async (file) => {
    // A loading image URL.
    const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a'

    const { uid, photoURL } = auth.currentUser
    try {
      // 1 - We add a message with a loading icon that will get updated with the shared image.
      const msgRef = await addDoc(messagesRef, {
        uid,
        imageUrl: LOADING_IMAGE_URL,
        photoURL,
        createdAt: Timestamp.now(),
      })

      // 2 - Upload the image to Cloud Storage.
      const filePath = `${uid}/${msgRef.id}/${file.name}`
      const newImageRef = ref(getStorage(), filePath)
      const fileSnapshot = await uploadBytesResumable(newImageRef, file)

      // 3 - Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef)

      // 4 - Update the chat message placeholder with the image's URL.
      await updateDoc(msgRef, {
        imageUrl: publicImageUrl,
        storageUri: fileSnapshot.metadata.fullPath,
      })
    } catch (error) {
      console.error(
        'There was an error uploading a file to Cloud Storage:',
        error
      )
    }
  }

  const addEmoji = (emoji) => {
    setMessage((message) => `${message}${emoji.native}`)
    setShowEmojiPicker(false)
  }
  return (
    <div className='message-panel'>
      {showEmojiPicker ? (
        <Picker set='google' native='true' onSelect={addEmoji} />
      ) : null}
      <form className='message-panel-form' onSubmit={sendMessage}>
        <input
          className='msg-input'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message and hit enter'
        />
        <button
          type='button'
          id='emoji-btn'
          className='chat-btns'
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <BsEmojiSmile />
        </button>

        <input
          id='mediaCapture'
          type='file'
          accept='image/*'
          capture='camera'
          onChange={onMediaFileSelected}
        />
        <button
          type='button'
          id='img-btn'
          className='chat-btns'
          title='Add an image'
          onClick={clickFileInput}
        >
          <MdOutlinePhotoSizeSelectActual />
        </button>
        <button
          id='send-btn'
          className='chat-btns'
          type='submit'
          disabled={!message}
        >
          SEND
        </button>
      </form>
    </div>
  )
}

export default MessagePanel
