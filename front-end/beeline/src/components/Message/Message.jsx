import React from 'react'
import './Message.css'
import cn from 'classnames'

export default function Message(props) {

  const { author, message, authorMessage } = props;
  
  if (authorMessage) {
    return (
      <div className={cn(['messageContainer', 'authorMessage'])}>
        <p className='author'>{author}</p>
        <p>{message}</p>
      </div>
    )
  } else {
    return (
      <div className='messageContainer'>
        <p className='author'>{author}</p>
        <p>{message}</p>
      </div>
    )
  }
}

