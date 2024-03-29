import React, { useState, useRef } from 'react';
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import { BsEmojiSmile } from 'react-icons/bs';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, BaseEmoji } from 'emoji-mart';
import { addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { auth, messagesRef } from '../firebase';

function MessagePanel() {
  const [message, setMessage] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Add message as a document to the database. */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { uid, photoURL } = auth.currentUser!;
      setMessage('');

      await addDoc(messagesRef, {
        text: message,
        uid,
        createdAt: Timestamp.now(),
        // * serverTimestamp has the delay, Timestamp.now() is a better choice
        // createdAt: serverTimestamp(),
        photoURL,
      });
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error);
    }
  };

  const saveImageMessage = async (file: File) => {
    // A loading image URL.
    const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

    const { uid, photoURL } = auth.currentUser!;
    try {
      // 1 - We add a message with a loading icon that will get updated with the shared image.
      const msgRef = await addDoc(messagesRef, {
        uid,
        imageUrl: LOADING_IMAGE_URL,
        photoURL,
        createdAt: Timestamp.now(),
      });

      // 2 - Upload the image to Cloud Storage.
      const filePath = `${uid}/${msgRef.id}/${file.name}`;
      const newImageRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);

      // 3 - Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef);

      // 4 - Update the chat message placeholder with the image's URL.
      await updateDoc(msgRef, {
        imageUrl: publicImageUrl,
        storageUri: fileSnapshot.metadata.fullPath,
      });
    } catch (error) {
      console.error(
        'There was an error uploading a file to Cloud Storage:',
        error
      );
    }
  };

  /** Get the image name when a local image is selected via the media picker.
   *  Then save the image message.
   */
  function onMediaFileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if the file is an image.
      if (!file.type.match('image.*')) {
        // eslint-disable-next-line no-alert
        alert('You can only share images');
        return;
      }
      // Check if the user is signed-in
      if (auth.currentUser) {
        saveImageMessage(file);
      }
    }
  }

  /**
   * Since we hide the file input, we click the button to trigger the input click instead.
   */
  const clickFileInput = (): void => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  return (
    <div className='message-panel'>
      {showEmojiPicker ? (
        <Picker
          set='google'
          native
          onSelect={(emoji: BaseEmoji) => {
            setMessage((prevMessage) => `${prevMessage}${emoji.native}`);
            setShowEmojiPicker(false);
          }}
        />
      ) : null}
      <form className='message-panel-form' onSubmit={sendMessage}>
        <input
          className='msg-input'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label='Type message here'
          placeholder='Type your message and hit enter'
        />
        <button
          type='button'
          id='emoji-btn'
          className='chat-btns'
          title='Add an emoji'
          aria-label='Add an emoji'
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <BsEmojiSmile />
        </button>

        <input
          id='mediaCapture'
          ref={inputRef}
          type='file'
          accept='image/*'
          aria-labelledby='img-btn'
          onChange={onMediaFileSelected}
          data-testid='fileDropzone'
        />
        <button
          type='button'
          id='img-btn'
          className='chat-btns'
          title='Add an image'
          onClick={clickFileInput}
          aria-label='Add an image'
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
  );
}

export default MessagePanel;
