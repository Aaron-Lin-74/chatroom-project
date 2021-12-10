import React, { useState, useEffect, useRef } from 'react'
import { getMessageQuery, onSnapshot } from '../firebase'
import MessagePanel from './MessagePanel'
import ChatMessage from './ChatMessage'

function ChatRoom() {
  const [messages, setMessages] = useState([])

  const chatBox = useRef()
  // Create the query to load the last 25 messages and listen for new ones.
  const query = getMessageQuery()

  // Start listening to the query.
  useEffect(() => {
    onSnapshot(query, function (snapshot) {
      setMessages(snapshot.docs.map((doc) => doc.data()))
      chatBox.current.scrollTop = chatBox.current.scrollHeight
    })
  }, [])

  return (
    <>
      <main ref={chatBox}>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </main>

      <MessagePanel />
    </>
  )
}
export default ChatRoom
