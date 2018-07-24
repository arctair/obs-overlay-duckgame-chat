import React, { Component } from 'react';
import './App.css'
import Message from './Message'
const channelPattern = RegExp('\\?channel=(.*)$')
const messagePattern = channel => RegExp(`:(.*?)!.*?@.*? PRIVMSG #${channel} :(.*)`)

class App extends Component {
  constructor() {
    super()
    const channelMatch = channelPattern.exec(window.location.href)
    this.state = {
      connected: false,
      messages: [],
      channel: channelMatch && channelMatch[1]
    }
    this.onWsOpen = this.onWsOpen.bind(this)
    this.onWsMessage = this.onWsMessage.bind(this)
    this.onWsClose = this.onWsClose.bind(this)
  }
  componentDidMount() {
    const { channel } = this.state
    if (channel) {
      this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443', 'irc')
      this.ws.onopen = this.onWsOpen
      this.ws.onmessage = this.onWsMessage
      this.ws.onclose = this.onWsClose
    }
  }
  onWsOpen() {
    const { channel } = this.state
    this.ws.send('PASS foobar')
    this.ws.send('NICK justinfan123')
    this.ws.send(`JOIN #${channel}`)
    this.setState(state => ({ ...state, connected: true }))
  }
  onWsMessage({ data }) {
    const { channel } = this.state
    const lines = data.split('\r\n')
    this.printLines(lines)
    this.handlePing(lines)
    this.updateMessageState(lines)
  }
  printLines(lines) {
    lines.forEach(line => console.log('<', line))
  }
  handlePing(lines) {
    lines
      .filter(line => line === 'PING :tmi.twitch.tv')
      .forEach(() => {
        this.ws.send('PONG :tmi.twitch.tv')
        console.log('>', 'PONG :tmi.twitch.tv')
      })
  }
  updateMessageState(lines) {
    this.setState(state => ({
      ...state,
      messages: state.messages.concat(this.messagesFromLines(lines)),
    }))
  }
  messagesFromLines(lines) {
    return lines
      .map(line => messagePattern(channel).exec(line))
      .filter(m => !!m)
      .map(([_, nick, message]) => ({ nick, message }))
  }
  onWsClose() {
    this.setState(state => ({ ...state, connected: false }))
  }
  componentDidUpdate() {
    if (this.isOverflowing())
      this.removeOldestMessage()
  }
  isOverflowing() {
    return this.element.offsetHeight < this.element.scrollHeight
  }
  removeOldestMessage() {
    this.setState(state => ({
      ...state,
      messages: state.messages.slice(1),
    }))
  }
  render() {
    const { connected, messages, channel } = this.state
    return (
      <div className='App' ref={element => this.element = element}>
        {
          !channel ?
          <React.Fragment>
            <p>Please specify a channel in the URL parameters</p>
            <p>For example, <a href='?channel=krispykitty'>{window.location.href}?channel=krispykitty</a></p>
          </React.Fragment> :
          !connected ?
          <Message nick='Server' message='Chat disconnected :<' /> :
          !messages.length ?
          <Message nick='Server' message='Chat connected!' /> :
          messages.map(Message)
        }
      </div>
    )
  }
}

export default App
