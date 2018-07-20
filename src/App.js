import React, { Component } from 'react';
import tmi from 'tmi.js'
import config from './config'
import './App.css'
import Message from './Message'

const { channel, oauth } = config
const opts = {
  identity: {
    username: 'my_bot',
    password: `oauth:${oauth}`,
  },
  channels: [ channel ]
}

const overflow = element => element.offsetHeight < element.scrollHeight
const setConnected = (connected, setState) => () =>
  setState(state => ({ ...state, connected }))

class App extends Component {
  constructor() {
    super()
    this.state = { connected: false, messages: [] }
    this.handleMessage = this.handleMessage.bind(this)
  }
  handleMessage(target, context, message, self) {
    const { 'display-name': displayName } = context
    this.setState(state => ({
      ...state,
      messages: state.messages.concat([[displayName, message]]),
    }))
  }
  componentDidMount() {
    const client = new tmi.client(opts)
    client.on('connected', setConnected(true, this.setState.bind(this)))
    client.on('message', this.handleMessage)
    client.on('disconnected', setConnected(false, this.setState.bind(this)))
    client.connect()
  }
  componentDidUpdate() {
    if (overflow(this.element)) {
      this.setState(state => ({
        ...state,
        messages: state.messages.slice(1),
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
          !connected && <Message displayName='Server' message='Chat disconnected :<' />}
      </div>
    )
  }
}

export default App
