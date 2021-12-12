import React, { useState, useEffect } from 'react'
import { getMessageQuery, onSnapshot } from '../firebase'
import MessagePanel from './MessagePanel'
import ChatMessage from './ChatMessage'

function ChatRoom() {
  const [messages, setMessages] = useState([])

  // Create the query to load the last 25 messages and listen for new ones.
  const query = getMessageQuery()

  // Start listening to the query.
  useEffect(() => {
    const unsubscribe = onSnapshot(query, function (snapshot) {
      setMessages(
        snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            createdAt: displayTime(doc.data().createdAt.toDate()),
          }
        })
      )

      scrollDown()
    })
    return unsubscribe
  }, [])

  // Scroll to the bottom of the chatbox
  const scrollDown = () => {
    const chatBox = document.getElementById('chatBox')
    chatBox.scrollTop = chatBox.scrollHeight
  }

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
  return (
    <>
      <main id='chatBox'>
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} scrollDown={scrollDown} />
          ))}
      </main>

      <MessagePanel />
    </>
  )
}
export default ChatRoom
