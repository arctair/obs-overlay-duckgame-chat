import React, { Component } from 'react';
import tmi from 'tmi.js'
import config from './config'
import './App.css'
import Message from './Message'

const { userName, oauth } = config
const opts = {
  identity: {
    username: 'my_bot',
    password: `oauth:${oauth}`,
  },
  channels: [ userName ]
}

const overflow = element => element.offsetHeight < element.scrollHeight

class App extends Component {
  constructor() {
    super()
    this.state = {
      connected: false,
      messages: [],
    }
    this.handleMessage = this.handleMessage.bind(this)
  }
  handleMessage(target, context, message, self) {
    console.log(target, context, message, self)
    const { 'display-name': displayName } = context
    this.setState(state => ({
      ...state,
      messages: [
        ...state.messages,
        [displayName, message],
      ],
    }))
  }
  componentDidMount() {
    const client = new tmi.client(opts)
    client.on('connected', () => this.setState(state => ({ ...state, connected: true })))
    client.on('message', this.handleMessage)
    client.on('disconnected', () => this.setState(state => ({ ...state, connected: false })))
    client.connect()
  }
  componentDidUpdate() {
    if (overflow(this.element)) {
      this.setState(state => ({
        ...state,
        messages: [ ...state.messages.slice(1), ],
      }))
    }
  }
  render() {
    const { connected, messages } = this.state
    return (
      <div className='App' ref={(element) => {this.element = element}}>
        {messages.map(([displayName, message], i) => ({ displayName, message, i })).map(Message)}
        {connected && messages.length == 0 ?
          <Message displayName='Server' message='Chat connected!' /> :
          !connected && <Message displayName='Server' message='Chat disconnected :<' i='-1' />}
      </div>
    )
  }
}

export default App
