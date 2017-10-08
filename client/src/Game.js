import 'moment-duration-format'
// import classNames from 'class-names'
import _ from 'lodash'
import React, { Component } from 'react'
// import moment from 'moment'

import KeyHandler from 'react-key-handler'
import background from './ispy.jpg'
// import maskTile from './mask.png'
// import blackTile from './blackTile.png'
import './Game.css'

import GameState from './shared/GameState.js'

// How frequently we poll the server for changes
const POLL_FREQUENCY = 500 // ms
const POLL_TIMEOUT = 1500 // ms

const fetchServer = path => {
  function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error('timeout'))
      }, ms)
      promise.then(resolve, reject)
    })
  }
  return timeout(POLL_TIMEOUT, fetch(`/${path}`))
  .then(response => response.json())
  .catch(error => {
    // alert('Whoops! The game broke. Check the error console.')
    console.error(error)
  })
}

class WaitForPlayerOne extends Component {

  render() {
    return (
      <div>
        {
          this.props.playerNum === 0 ?
          <button onClick={this.props.join}>Let's play!</button>
          :
          null
        }
      </div>
    )
  }

}

class WaitForPlayerTwo extends Component {

  render() {
    return (
      <div>
        {
          this.props.playerNum === 0 ?
          <div className="InRound-title">Waiting for player 2...</div>
          :
          <button onClick={this.props.join}>Join Game!</button>
        }
      </div>
    )
  }

}

class WaitForRoundStart extends Component {

  render() {
    return (
      <div>
        {
          this.props.playerNum === 0 ?
          <button onClick={this.props.startRound}>Start Game!</button>
          :
          <div className="InRound-title">Waiting for player 1 to start the game...</div>
        }
      </div>
    )
  }

}

class RoundEnded extends Component {

  render() {
    return (
      <div className="RoundEnded">
        <div className="RoundEnded-text">🎉</div>
        <button onClick={this.props.restartRound}>Again?</button>
      </div>

    )
  }

}

class InRound extends Component {

  render() {
    return (
      <div className='InRound'>
        <div className="InRound-title">
          {
          !this.props.getLocalPlayer().inTurn ?
            "It's your partner's move."
           :
            "It's your move!"
          }
        </div>
        <div className="InRound-subtitle">
          {
          !this.props.getLocalPlayer().inTurn ?
            "Try to figure out where they are!"
           :
            "Move to your partner using the arrow keys!"
          }
        </div>
        {
          !this.props.getLocalPlayer().inTurn ? null :
          ['Up', 'Down', 'Right', 'Left'].map(dir => (
            <KeyHandler
              keyEventName="keydown"
              keyValue={`Arrow${dir}`}
              key={dir}
              onKeyHandle={event => event.preventDefault() || this.props.move(dir)}
            />
          ))
        }
        <img
          className="Grid-Image"
          alt=""
          src={background}
          style={{opacity: this.image ? 'unset' : 0}}
          ref={img => this.image = img}
        />
        {
          !this.image ? null :
          <Grid
            rows={this.props.board.gridSize}
            imageWidth={this.image.width}
            imageHeight={this.image.height}
            cols={this.props.board.gridSize}
            revealed={this.props.getLocalPlayer()}
          />
        }
      </div>
    )
  }

}

class Grid extends Component {

  render() {
    const {
      revealed,
      cols,
      rows,
      imageHeight,
      imageWidth,
    } = this.props

    const isRevealed = (x, y) => (x === revealed.x && y === revealed.y)
      console.log(imageWidth, imageHeight)
      console.log(rows, cols)
    return (
      <div className="Grid" style={{marginTop: -imageHeight}}>
        {
          _.range(rows).map(x => (
            <div className="Grid-Row" key={x}>
              {
                _.range(cols).map(y => (
                    isRevealed(x,y) ?
                    <div
                      key={`${x},${y}`}
                      className='Grid-Square'
                      style={{width: imageWidth / rows, height: imageHeight / cols, background: 'unset'}} />
                    : <div
                      key={`${x},${y}`}
                      className='Grid-Square'
                      style={{width: imageWidth / rows, height: imageHeight / cols, background: 'black'}} />
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }
}

class DebugTools extends Component {

  render() {
    return (
      <div className="DebugTools">
        <KeyHandler
          keyEventName="keydown"
          keyValue='~'
          onKeyHandle={this.props.reset}
        />
        <KeyHandler
          keyEventName="keydown"
          keyValue='`'
          onKeyHandle={this.props.toggleDebug}
        />
        {
          !this.props.state.debug ? null :
          <div className="Debug">
            <pre className="Debug-Phase">{GameState.Phases[this.props.state.phase]}</pre>
            <pre className="Debug-State">{JSON.stringify(this.props.state, null, 2)}</pre>
          </div>
        }
      </div>
    )
  }

}

const phaseComponents = [
  React.createFactory(WaitForPlayerOne),
  React.createFactory(WaitForPlayerTwo),
  React.createFactory(WaitForRoundStart),
  React.createFactory(InRound),
  React.createFactory(RoundEnded),
]

class Game extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // Local
      debug: false,
      playerNum: document.location.search.includes('1') ? 1 : 0,

      ...GameState.InitialState,
    }
    this.onPollTimer()
    setInterval(this.onPollTimer.bind(this), POLL_FREQUENCY)
  }

  getLocalPlayer() {
    return this.state.players[this.state.playerNum]
  }

  onPollTimer() {
    fetchServer('state')
    .then(gameState => this.onNewGameState(gameState))
  }

  onNewGameState(nextGameState) {
    this.setState({...nextGameState})
  }

  move(key) {
    let {x, y} = this.getLocalPlayer()
    if (key === 'Up') y -= 1
    if (key === 'Down') y += 1
    if (key === 'Right') x += 1
    if (key === 'Left') x -= 1
    if (x < 0 || x >= this.state.board.gridSize) return
    if (y < 0 || y >= this.state.board.gridSize) return

    fetchServer(`move/${this.state.playerNum}/${x}/${y}`)
    .then(gameState => this.onNewGameState(gameState))
  }

  join() {
    fetchServer(`join/${this.state.playerNum}`)
    .then(gameState => this.onNewGameState(gameState))
  }

  reset() {
    if (!this.state.debug) return
    fetchServer(`reset`)
    .then(gameState => this.onNewGameState(gameState))
  }

  startRound() {
    fetchServer(`round/start`)
    .then(gameState => this.onNewGameState(gameState))
  }

  restartRound() {
    fetchServer(`round/restart`)
    .then(gameState => this.onNewGameState(gameState))
  }

  render() {
    return (
      <div className="Game">
        <div className="Title">Tunnel Vision</div>
        <DebugTools
            toggleDebug={() => this.setState({debug: !this.state.debug})}
            reset={this.reset.bind(this)}
            state={this.state}
        />
        { phaseComponents[this.state.phase]({
          ...this.state,
          move: this.move.bind(this),
          join: this.join.bind(this),
          startRound: this.startRound.bind(this),
          restartRound: this.restartRound.bind(this),
          getLocalPlayer: this.getLocalPlayer.bind(this),
        }) }
      </div>
    )
  }

}

export default Game;
