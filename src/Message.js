import React from 'react';
import hashString from 'string-hash'
import hats from './hats'
import users from './users'

const colors = ['white', 'grey', 'yellow', 'brown']
const hatFrom = (displayName) => displayName in users ? hats[users[displayName]] : displayName in hats ? hats[displayName] : hats['defaultduck']
const Message = ({ displayName, message, i }) => (
  <div className='chat-msg' key={i}>
    <span className={colors[hashString(displayName) % 4]}>
      <img src={hatFrom(displayName.toLowerCase())} alt=''/>
      <span className='chat-dn'>{displayName}: </span>
      {message}
    </span>
  </div>
)

export default Message
