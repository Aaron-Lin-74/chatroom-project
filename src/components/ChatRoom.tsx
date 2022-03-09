import React, { useState, useEffect, useRef } from 'react';
import { getMessageQuery, onSnapshot } from '../firebase';
import MessagePanel from './MessagePanel';
import ChatMessage from './ChatMessage';
import { MessageType } from '../types/message';

function ChatRoom() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageNumber, setMessageNumber] = useState(25);
  const spanRef = useRef<HTMLSpanElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Check the user has scroll to the top of the chat box
  const checkScrollTop = (e: Event) => {
    const targetDiv = e.target as HTMLDivElement;
    if (targetDiv.scrollTop === 0) {
      // Display the show more clickable
      if (spanRef.current !== null) {
        spanRef.current.style.display = 'block';
      }
    }
  };

  // When the user click show more, load 25 more old messages
  const showMoreMessages = () => {
    setMessageNumber((messageNumber) => (messageNumber += 25));
    if (spanRef.current !== null) {
      spanRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    // Check whether to load the extra messages when scroll to top
    const chatBox = chatBoxRef.current;
    if (chatBox !== null) {
      chatBox.addEventListener('scroll', checkScrollTop);
    }

    return () => {
      if (chatBox !== null) {
        chatBox.removeEventListener('scroll', checkScrollTop);
      }
    };
  }, []);

  // Start listening to the query.
  useEffect(() => {
    // Create the query to load the last n messages and listen for new ones.
    const query = getMessageQuery(messageNumber);

    // If in the same day, just show the hour:min, otherwise show the date and time
    const displayTime = (date: Date) => {
      const now = new Date();
      if (isSameDay(date, now)) {
        return formatTime(date.getHours(), date.getMinutes());
      }
      return `${date.toDateString()} ${formatTime(
        date.getHours(),
        date.getMinutes()
      )}`;
    };
    const unsubscribe = onSnapshot(query, function (snapshot) {
      const descMessages: MessageType[] = snapshot.docs.map((doc) => {
        // Add createdAt, and unique id properties to the message data object
        return {
          ...doc.data(),
          photoURL: doc.data().photoURL,
          uid: doc.data().uid,
          createdAt: displayTime(doc.data().createdAt.toDate()),
          id: doc.id,
        };
      });
      // since the lastest n messages are in descend order, so we need to reverse
      setMessages(descMessages.reverse());
      scrollDown();
    });
    return unsubscribe;
  }, [messageNumber]);

  // Scroll to the bottom of the chatbox
  const scrollDown = () => {
    if (chatBoxRef.current !== null) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // Change the time format to '00:00'
  const formatTime = (hour: number, minute: number): string => {
    return `${hour < 10 ? '0' + hour : hour}:${
      minute < 10 ? '0' + minute : minute
    }`;
  };

  // return true is two dates are of the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    if (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      return true;
    }
    return false;
  };
  return (
    <main id='chatBox' ref={chatBoxRef}>
      <span id='show-more-message' ref={spanRef} onClick={showMoreMessages}>
        _______ Show more ________
      </span>
      <div className='message-box'>
        {messages &&
          messages.map((msg) => {
            return (
              <ChatMessage key={msg.id} message={msg} scrollDown={scrollDown} />
            );
          })}
      </div>
      <MessagePanel />
    </main>
  );
}
export default ChatRoom;
