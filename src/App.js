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
  onWsOpen() {
    const { channel } = this.state
    this.ws.send('PASS foobar')
    this.ws.send('NICK justinfan123')
    this.ws.send(`JOIN #${channel}`)
    this.setState(state => ({ ...state, connected: true }))
  }
  onWsMessage(e) {
    const { channel } = this.state
    const lines = e.data.split('\r\n')
    lines.forEach(line => console.log('> ', line))
    lines.filter(line => line === 'PING :tmi.twitch.tv')
      .forEach(() => this.ws.send('PONG :tmi.twitch.tv'))
    const messages = lines
      .map(line => messagePattern(channel).exec(line))
      .filter(m => !!m)
      .map(([_, nick, message], i) => ({ nick, message, i }))
    this.setState(state => ({
      ...state,
      messages: state.messages.concat(messages),
    }))
  }
  onWsClose() {
    this.setState(state => ({ ...state, connected: false }))
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
  componentDidUpdate() {
    // if App is overflowing
    if (this.element.offsetHeight < this.element.scrollHeight) {
      // remove the oldest message in state
      this.setState(state => ({
        ...state,
        messages: state.messages.slice(1),
      }))
    }
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
