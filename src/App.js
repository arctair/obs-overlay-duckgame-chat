import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

App.propTypes = {
  connected: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  channel: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onOverflow: PropTypes.func.isRequired,
}

export default App
