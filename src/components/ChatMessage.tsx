import { auth } from '../firebase';
import { useRef } from 'react';
import { MessageType } from '../types/message';

interface PropsType {
  message: MessageType;
  scrollDown: () => void;
}
function ChatMessage(props: PropsType) {
  const { text, uid, photoURL, imageUrl, createdAt } = props.message;
  const { scrollDown } = props;
  const myModal = useRef<HTMLDivElement>(null!);
  const imageModal = useRef<HTMLImageElement>(null!);
  const profileModal = useRef<HTMLDivElement>(null!);
  const profilePhoto = useRef<HTMLImageElement>(null!);

  // set current user's message class to sent to distinguish from others
  const messageClass = uid === auth.currentUser?.uid ? 'sent' : 'received';

  /** Open the image modal, to show the clicked image */
  const showModal = (): void => {
    // Get the image and insert it inside the modal
    myModal.current.style.display = 'block';
    imageModal.current.setAttribute('src', imageUrl!);
  };

  /** Close the modal when the user clicks on <span> (x)*/
  const closeModal = (): void => {
    // Get the <span> element that closes the modal
    myModal.current.style.display = 'none';
    imageModal.current.setAttribute('src', '');
  };

  /** Open the profile modal, to show the profile image */
  const showProfilePhoto = (): void => {
    profileModal.current.style.display = 'block';
    profilePhoto.current.src = photoURL || '/images/default_profile.jpg';
  };

  /** Close the profile modal */
  const closeProfileModal = (): void => {
    profileModal.current.style.display = 'none';
    profilePhoto.current.src = '';
  };

  return (
    <>
      <div className='timeStamp'>
        <p className='messageTime'>{createdAt}</p>
      </div>
      <div className={`message ${messageClass}`}>
        <img
          className='profilePhoto'
          src={photoURL || '/images/default_profile.jpg'}
          referrerPolicy='no-referrer'
          alt='profile'
          onClick={showProfilePhoto}
        />
        <div className='profile-modal' ref={profileModal}>
          <div className='profile-photo-container'>
            <span onClick={closeProfileModal} className='close-profile-modal'>
              &times;
            </span>
            <img
              className='big-profile-Photo'
              referrerPolicy='no-referrer'
              alt='profile'
              ref={profilePhoto}
            />
          </div>
        </div>
        {text ? (
          <p className='messageText'>{text}</p>
        ) : (
          <>
            <img
              className='messagePhoto'
              src={imageUrl}
              referrerPolicy='no-referrer'
              alt='messagePhoto'
              onClick={showModal}
              onLoad={scrollDown}
            />
            <div className='modal' ref={myModal}>
              <span onClick={closeModal} className='closeModal'>
                &times;
              </span>
              <img
                className='modal-photo'
                referrerPolicy='no-referrer'
                alt='messagePhoto'
                ref={imageModal}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default ChatMessage;
