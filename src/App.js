import React, { Component } from 'react'
import './App.css'
import Message from './Message'

class App extends Component {
  render() {
    const { connected, messages, channel } = this.props
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
  componentDidUpdate() {
    const { onOverflow } = this.props
    if (this.isOverflowing())
      onOverflow()
  }
  isOverflowing() {
    return this.element.offsetHeight < this.element.scrollHeight
  }
}

export default App
