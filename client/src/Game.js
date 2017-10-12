// import 'moment-duration-format'
// import classNames from 'class-names'
// import _ from 'lodash'
import React, { Component } from 'react'
// import moment from 'moment'
import './Game.css'

import GameState from './shared/GameState'
import DrunkardView from './DrunkardView'
import DriverView from './DriverView'
import DebugView from './DebugView'
import UndeclaredView from './UndeclaredView'

import Logo from './logo.svg'

// How frequently we poll the server for changes
const POLL_FREQUENCY = 1000 // ms
const POLL_TIMEOUT = 1500 // ms

const Roles = {
  Drunkard: 'drunkard',
  Driver: 'driver',
  Undeclared: 'undeclared',
}

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

class Game extends Component {

  constructor(props) {
    super(props)

    const determineRole = () => {
      const atPath = path => document.location.pathname === `/${path}`
      if (atPath('drunk')) return Roles.Drunkard
      if (atPath('driver')) return Roles.Driver
      return Roles.Undeclared
    }

    this.state = {
      // Local
      role: determineRole(),
      isLoading: true,

      ...GameState.InitialState,
    }
    this.onPollTimer()
    setInterval(this.onPollTimer.bind(this), POLL_FREQUENCY)
  }

  onPollTimer() {
    fetchServer('state')
    .then(gameState => this.onNewGameState(gameState))
  }

  onNewGameState(nextGameState) {
    this.setState({...nextGameState, isLoading: false})
  }

  wrapAroundMove(coordinates, direction) {
    let {x, y} = coordinates
    // Wrap around coodinates
    const wrapAround = z => {
      if (z >= GameState.MAP_SIZE) return GameState.MAP_SIZE - z
      if (z < 0) return GameState.MAP_SIZE - 1
      return z
    }
    if (direction === 'Up') y = wrapAround(y - 1)
    if (direction === 'Down') y = wrapAround(y + 1)
    if (direction === 'Right') x = wrapAround(x + 1)
    if (direction === 'Left') x = wrapAround(x - 1)
    return {x, y}
  }

  pickup() {
    fetchServer('pickup')
    .then(gameState => this.onNewGameState(gameState))
  }

  moveDrunkard(direction) {
    let {x, y} = this.wrapAroundMove(this.state.drunkard, direction)
    fetchServer(`move/drunkard/${x}/${y}`)
    .then(gameState => this.onNewGameState(gameState))
  }

  moveDriver(direction) {
    let {x, y} = this.wrapAroundMove(this.state.driver, direction)
    fetchServer(`move/driver/${x}/${y}`)
    .then(gameState => this.onNewGameState(gameState))
  }

  joinAsDrunkard() {
    fetchServer('join/drunkard')
    .then(gameState => this.onNewGameState(gameState))
  }

  joinAsDriver() {
    fetchServer('join/driver')
    .then(gameState => this.onNewGameState(gameState))
  }

  resetGame() {
    fetchServer('reset')
    .then(gameState => this.onNewGameState(gameState))
  }

  render() {
    if (this.state.isLoading) {
      return ''
    }

    const viewForRole = role => {
      if (role === Roles.Driver) return DriverView
      if (role === Roles.Drunkard) return DrunkardView
      if (role === Roles.Undeclared) return UndeclaredView
    }
    if (this.state.role !== Roles.Undeclared) {
      document.title = `Intaxicated: ${this.state.role}`
    }
    const roleView = React.createFactory(viewForRole(this.state.role))
    return (
      <div className="Game">
        <DebugView gameState={this.state} resetGame={this.resetGame.bind(this)}/>
        {
          (this.state.role === Roles.Undeclared) && (this.state.phase === GameState.Phases.IN_GAME) ?
          <div className="Game-InProgress">
            Game in progress!
            <button onClick={this.resetGame.bind(this)}>End game</button>
          </div>
          : null
        }
        {roleView({
          ...this.state,
          joinAsDrunkard: this.joinAsDrunkard.bind(this),
          joinAsDriver: this.joinAsDriver.bind(this),
          moveDrunkard: this.moveDrunkard.bind(this),
          moveDriver: this.moveDriver.bind(this),
          pickup: this.pickup.bind(this),
          resetGame: this.resetGame.bind(this),
        })}
        <div className="Footer">
          <div className="Footer-Links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Investors</a>
          </div>
          &copy; 2017 Drunk Ride Sharing
        </div>
      </div>
    )
  }

}

export default Game;
