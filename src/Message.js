import React from 'react';
import hashString from 'string-hash'
import hats from './hats'
import users from './users'

const colors = ['white', 'grey', 'yellow', 'brown']
const hatFrom = (nick) => nick in users ? hats[users[nick]] : nick in hats ? hats[nick] : hats['defaultduck']
const Message = ({ nick = '?', message, i }) => (
  <div className='chat-msg' key={i}>
    <span className={colors[hashString(nick) % 4]}>
      <img src={hatFrom(nick.toLowerCase())} alt=''/>
      <span className='chat-dn'>{nick}: </span>
      {message}
    </span>
  </div>
)

export default Message
