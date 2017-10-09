import React, { Component } from 'react'

class UndeclaredView extends Component {

  render() {
    return (
      <div>
        { this.props.drunkard.joined ? null :
          <button onClick={() => window.location.pathname = '/drunk'}>Be drunkard</button> }
        { this.props.driver.joined ? null :
          <button onClick={() => window.location.pathname = '/driver'}>Be driver</button> }
      </div>
    )
  }

}

export default UndeclaredView
