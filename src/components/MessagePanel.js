import React, { useState } from 'react'
import { auth, messagesRef } from '../firebase'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

function MessagePanel() {
  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser
    try {
      await addDoc(messagesRef, {
        text: formValue,
        uid,
        // createdAt: Timestamp.now(),
        createdAt: serverTimestamp(),
        photoURL,
      })
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error)
    }
    setFormValue('')
    // dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  // Triggered when a file is selected via the media picker.
  function onMediaFileSelected(e) {
    e.preventDefault()
    const file = e.target.files[0]
    console.log(file)
    // Check if the file is an image.
    if (!file.type.match('image.*')) {
      var data = {
        message: 'You can only share images',
        timeout: 2000,
      }

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
        createdAt: serverTimestamp(),
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
  return (
    <div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder='Type your message and hit enter'
        />

        <button type='submit' disabled={!formValue}>
          SEND
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
          id='submitImage'
          title='Add an image'
          onClick={clickFileInput}
        >
          <MdOutlinePhotoSizeSelectActual />
        </button>
      </form>
    </div>
  )
}

export default MessagePanel
