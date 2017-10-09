import React, { Component } from 'react'
import KeyHandler from 'react-key-handler'


class DebugView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      enabled: true,
    }
  }

  reset() {
    if (!this.state.enabled) return
    this.props.fetchServer('reset')
  }

  toggle() {
    this.setState({enabled: !this.state.enabled})
  }

  render() {
    return (
      <div className="DebugView">
        <KeyHandler
          keyEventName="keydown"
          keyValue='~'
          onKeyHandle={this.props.resetGame}
        />
        <KeyHandler
          keyEventName="keydown"
          keyValue='`'
          onKeyHandle={this.toggle.bind(this)}
        />
        {
          !this.state.enabled ? null :
          <div className="Debug">
            <pre className="Debug-Phase">Status: {this.props.gameState.phase}</pre>
            <pre className="Debug-State">{JSON.stringify(this.props.gameState, null, 2)}</pre>
          </div>
        }
      </div>
    )
  }

}
export default DebugView
