import { auth } from '../firebase'

function ChatMessage(props) {
  const { text, uid, photoURL, imageUrl, createdAt } = props.message

  // set current user's message class to sent to distinguish from others
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  const displayTime = (date) => {
    // If in the same day, just show the hour:min, otherwise show the date and time
    const now = new Date()
    if (isSameDay(date, now)) {
      // If within the same minute, not showing the time stamp
      if (date.getMinutes() === now.getMinutes()) return
      return `${date.getHours()}:${date.getMinutes()}`
    }
    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`
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
          src={photoURL}
          referrerPolicy='noreferrer'
          alt='profile'
        />
        {text ? (
          <p className='messageText'>{text}</p>
        ) : (
          <img
            className='messagePhoto'
            src={imageUrl}
            referrerPolicy='noreferrer'
            alt='messagePhoto'
          />
        )}
      </div>
    </>
  )
}
export default ChatMessage
