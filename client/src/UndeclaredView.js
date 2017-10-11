import React, { Component } from 'react'

import Logo from './logo.svg'
import WhereTo from './where-to.svg'


class UndeclaredView extends Component {

  render() {
    return (
      <div className="UndeclaredView">
        <img className="UndeclaredView-Logo" src={Logo}/>
        <div className="UndeclaredView-Title">Drunk Ride Sharing</div>
        {/* <img className="UndeclaredView-WhereTo" alt="new game" src={WhereTo}/> */}
        {/* <button onClick={this.resetGame.bind(this)}>New game</button> */}
        <div className="UndeclaredView-Buttons">
          { this.props.drunkard.joined ? null :
            <button onClick={() => window.location.pathname = '/drunk'}>Be drunkard</button> }
          { this.props.driver.joined ? null :
            <button className="btn-reverse" onClick={() => window.location.pathname = '/driver'}>Be driver</button> }
        </div>
      </div>
    )
  }

}

export default UndeclaredView
