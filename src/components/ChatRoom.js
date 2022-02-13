import React, { useState, useEffect } from 'react'
import { getMessageQuery, onSnapshot } from '../firebase'
import MessagePanel from './MessagePanel'
import ChatMessage from './ChatMessage'

function ChatRoom() {
  const [messages, setMessages] = useState([])
  const [messageNumber, setMessageNumber] = useState(25)

  // Check the user has scroll to the top of the chat box
  const checkScrollTop = (e) => {
    if (e.target.scrollTop === 0) {
      // Display the show more clickable
      document.getElementById('show-more-message').style.display = 'block'
    }
  }

  // When the user click show more, load 25 more old messages
  const showMoreMessages = () => {
    setMessageNumber((messageNumber) => (messageNumber += 25))
    document.getElementById('show-more-message').style.display = 'none'
  }

  useEffect(() => {
    // Check whether to load the extra messages when scroll to top
    document
      .getElementById('chatBox')
      .addEventListener('scroll', checkScrollTop)
    return () => {
      document
        .getElementById('chatBox')
        .removeEventListener('scroll', checkScrollTop)
    }
  }, [])

  // Start listening to the query.
  useEffect(() => {
    // Create the query to load the last n messages and listen for new ones.
    const query = getMessageQuery(messageNumber)

    // If in the same day, just show the hour:min, otherwise show the date and time
    const displayTime = (date) => {
      const now = new Date()
      if (isSameDay(date, now)) {
        return formatTime(date.getHours(), date.getMinutes())
      }
      return `${date.toDateString()} ${formatTime(
        date.getHours(),
        date.getMinutes()
      )}`
    }
    const unsubscribe = onSnapshot(query, function (snapshot) {
      const descMessages = snapshot.docs.map((doc) => {
        // Add createdAt property to the message data object
        return {
          ...doc.data(),
          createdAt: displayTime(doc.data().createdAt.toDate()),
        }
      })
      // since the lastest n messages are in descend order, so we need to reverse
      setMessages(descMessages.reverse())
      console.log('in side effect')
      scrollDown()
    })
    return unsubscribe
  }, [messageNumber])

  // Scroll to the bottom of the chatbox
  const scrollDown = () => {
    const chatBox = document.getElementById('chatBox')
    chatBox.scrollTop = chatBox.scrollHeight
  }

  // Change the time format to '00:00'
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
  return (
    <>
      <main id='chatBox'>
        <span id='show-more-message' onClick={showMoreMessages}>
          _______ Show more ________
        </span>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              id={msg.id}
              scrollDown={scrollDown}
            />
          ))}
      </main>

      <MessagePanel />
    </>
  )
}
export default ChatRoom
