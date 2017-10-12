import React, { Component } from 'react'

class WinLoseView extends Component {

  render() {
    return (
      <div className="WinLoseView">
        <div className="WinLoseView-Title">Game Over!</div>
        <div className="WinLoseView-Text">
          You { this.props.victory ? 'win' : 'lose' }.
        </div>
        <button onClick={this.props.resetGame}>again?</button>
      </div>
    )
  }

}

export default WinLoseView
