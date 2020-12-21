import React, { useEffect, useState } from 'react'
import './ChatRoom.css'
import io from "socket.io-client";
import { Message } from '../../components/Message';

export default function ChatRoom(props) {

  const { userName } = props;

  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:8000', {
      query: {
        userName
      }
    });
    setSocket(socket);
  }, [])

  useEffect(() => {
    socket && socket.on('broadcast', (data) => {
      setChatMessages(state => {
        const authorMessage = userName === data.from;
        return [...state, { author: data.from, message: data.message, authorMessage: authorMessage }];
      })
    })
  }, [socket])

  return (
    <div className='container'>
      <h2>Привет {userName}</h2>
      <div id='chatContainer'>
        <div id='chatWindow'>
          {chatMessages.length === 0 ?
          <div>Сообщений нету. пока что!</div> :
          chatMessages.map(({ author, message, authorMessage}, index) => (
            <Message key={`message${index}`} {...{ author, message, authorMessage }} />
          )) }
        </div>
        <form 
            onSubmit={(e) => {
            e.preventDefault();
            socket.send({ message })
          }}>
            <input
            id='input'
            type='text'
            placeholder='Сообщение'
            name='name'
            onChange={(e) => setMessage(e.target.value)}/>
            <input
            id='button'
            type='submit'
            value='Отправить'
            />
          </form>
      </div>
    </div>
  )
}
