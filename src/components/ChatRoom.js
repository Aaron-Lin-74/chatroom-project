import React, { useRef } from 'react'
import { getMessageQuery } from '../firebase'
import MessagePanel from './MessagePanel'
import ChatMessage from './ChatMessage'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function ChatRoom() {
  const dummy = useRef()

  const q = getMessageQuery()
  const [messages] = useCollectionData(q, { idField: 'id' })

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <MessagePanel />
    </>
  )
}
export default ChatRoom
