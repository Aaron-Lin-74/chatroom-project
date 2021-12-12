import { auth } from '../firebase'
import { useRef } from 'react'

function ChatMessage(props) {
  const { text, uid, photoURL, imageUrl, createdAt } = props.message
  const myModal = useRef(null)
  const imageModal = useRef(null)

  // set current user's message class to sent to distinguish from others
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  const displayTime = (date) => {
    // If in the same day, just show the hour:min, otherwise show the date and time
    const now = new Date()
    if (isSameDay(date, now)) {
      return formatTime(date.getHours(), date.getMinutes())
    }
    return `${date.toDateString()} ${formatTime(
      date.getHours(),
      date.getMinutes()
    )}`
  }

  const formatTime = (hour, minute) => {
    return `${hour < 10 ? '0' + hour : hour}:${
      minute < 10 ? '0' + minute : minute
    }`
  }
  // return true is two dates are of the same day
  const isSameDay = (date1, date2) => {
    if (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      return true
    }
    return false
  }

  const showModal = () => {
    // Get the image and insert it inside the modal
    myModal.current.style.display = 'block'
    imageModal.current.src = imageUrl
  }

  // When the user clicks on <span> (x), close the modal
  const closeModal = () => {
    // Get the <span> element that closes the modal
    myModal.current.style.display = 'none'
  }
  return (
    <>
      <div className='timeStamp'>
        <p className='messageTime'>
          {createdAt && displayTime(createdAt.toDate())}
        </p>
      </div>
      <div className={`message ${messageClass}`}>
        <img
          className='profilePhoto'
          src={photoURL || '/images/default_profile.jpg'}
          referrerPolicy='noreferrer'
          alt='profile'
        />
        {text ? (
          <p className='messageText'>{text}</p>
        ) : (
          <>
            <img
              className='messagePhoto'
              src={imageUrl}
              referrerPolicy='noreferrer'
              alt='messagePhoto'
              onClick={showModal}
            />
            <div className='modal' ref={myModal}>
              <span onClick={closeModal} className='closeModal'>
                &times;
              </span>
              <img
                className='modal-photo'
                referrerPolicy='noreferrer'
                alt='messagePhoto'
                ref={imageModal}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default ChatMessage
