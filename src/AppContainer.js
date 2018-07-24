import React, { Component } from 'react'
import App from './App'
const channelPattern = RegExp('\\?channel=(.*)$')
const messagePattern = channel => RegExp(`:(.*?)!.*?@.*? PRIVMSG #${channel} :(.*)`)

const initialState = channel => ({
  connected: false,
  messages: [],
  channel,
})

class AppContainer extends Component {
  constructor() {
    super()
    this.state = initialState(this.getChannelFromQueryParams())
  }
  getChannelFromQueryParams() {
    const channelMatch = channelPattern.exec(window.location.href)
    return channelMatch && channelMatch[1]
  }
  componentDidMount() {
    const { channel } = this.state
    if (channel) {
      this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443', 'irc')
      this.ws.onopen = this.onWsOpen.bind(this)
      this.ws.onmessage = this.onWsMessage.bind(this)
      this.ws.onclose = this.onWsClose.bind(this)
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
    const { channel } = this.state
    return lines
      .map(line => messagePattern(channel).exec(line))
      .filter(m => !!m)
      .map(([_, nick, message]) => ({ nick, message }))
  }
  onWsClose() {
    this.setState(state => ({ ...state, connected: false }))
  }
  render() {
    const { connected, messages, channel } = this.state
    return <App
      connected={connected}
      messages={messages}
      channel={channel}
      onOverflow={this.removeOldestMessage.bind(this)} />
  }
  removeOldestMessage() {
    this.setState(state => ({
      ...state,
      messages: state.messages.slice(1),
    }))
  }
}

export default AppContainer
