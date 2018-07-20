import React, { Component } from 'react';
import './App.css'
import Message from './Message'

const channelMatch = RegExp('\\?channel=(.*)$').exec(window.location.href)
const channel = channelMatch && channelMatch[1]

const overflow = element => element.offsetHeight < element.scrollHeight
const setConnected = (connected, setState) => () =>
  setState(state => ({ ...state, connected }))
const messagePattern = new RegExp(`:(.*?)!(.*?)@(.*?) PRIVMSG (#${channel}) :(.*)`)
const decomposeEvent = e => e.data
  .split('\r\n')
  .map(m => { console.log('> ', m); return m; })
  .map(messagePattern.exec.bind(messagePattern))
  .filter(m => !!m)
  .map(([_, nick, host, server, channel, message]) => [nick, message])

class App extends Component {
  constructor() {
    super()
    this.state = { connected: false, messages: [] }
    this.handleMessage = this.handleMessage.bind(this)
  }
  handleMessage(messageObject) {
    this.setState(state => ({
      ...state,
      messages: state.messages.concat([messageObject]),
    }))
  }
  componentDidMount() {
    if (channel) {
      const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443', 'irc')
      ws.onopen = () => {
        ws.send('PASS foobar')
        ws.send('NICK justinfan123')
        ws.send(`JOIN #${channel}`)
        setConnected(true, this.setState.bind(this))()
      }
      ws.onmessage = e => decomposeEvent(e).map(this.handleMessage)
      ws.onclose = setConnected(false, this.setState.bind(this))
    }
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
    if (!channel) {
      return (
        <div className='App'>
          <p>Please specify a channel in the URL parameters</p>
          <p>For example, <a href='?channel=krispykitty'>{window.location.href}?channel=krispykitty</a></p>
        </div>
      )
    }
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
