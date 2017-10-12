// import 'moment-duration-format'
// import classNames from 'class-names'
import _ from 'lodash'
import React, { Component } from 'react'
// import moment from 'moment'
import './Game.css'

import GameState from './shared/GameState'
import DrunkardView from './DrunkardView'
import DriverView from './DriverView'
import DebugView from './DebugView'
import UndeclaredView from './UndeclaredView'

import { getValidDirections } from './MapUtils'

import mapImageSrc from './map.svg'
import Logo from './logo.svg'

function imgLoaded(imgElement) {
  return imgElement.complete && imgElement.naturalHeight !== 0;
}

// How frequently we poll the server for changes
const POLL_FREQUENCY = 500 // ms
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

    this.mapImage = new Image()
    this.mapImage.src = mapImageSrc

    this.state = {
      role: determineRole(),
      isLoading: true,
      gameState: GameState.InitialState,
    }
    this.onPollTimer()
    setInterval(this.onPollTimer.bind(this), POLL_FREQUENCY)
  }

  // optimization not necessary based on timing
  // shouldComponentUpdate(nextProps, nextState) {
  //   return ! _.isEqual(nextState.gameState, this.state.gameState)
  // }

  onPollTimer() {
    fetchServer('state')
    .then(gameState => this.onNewGameState(gameState))
  }

  onNewGameState(nextGameState) {
    if (!nextGameState) return
    this.setState({gameState: nextGameState, isLoading: false})
  }

  canMoveInDirection(coordinates, direction) {
    console.time('canMoveInDirection')
    let {x, y} = coordinates
    const validDirections = getValidDirections(this.mapImage, x, y)
    console.timeEnd('canMoveInDirection')
    return validDirections[direction]
  }

  wrapAroundMove(coordinates, direction, options) {
    let {x, y} = coordinates
    // Ensure staying on road if needed
    if (options.stayOnRoad && options.stayOnRoad === true) {
      console.log('stayOnRoad')
      if (!this.canMoveInDirection(coordinates, direction)) {
        return {x, y}
      }
    }
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

  attemptPickup() {
    fetchServer('pickup/attempt')
    .then(gameState => this.onNewGameState(gameState))
  }

  confirmPickup() {
    fetchServer('pickup/confirm')
    .then(gameState => this.onNewGameState(gameState))
  }

  moveDrunkard(direction) {
    let {x, y} = this.wrapAroundMove(
      this.state.gameState.drunkard,
      direction,
      { stayOnRoad: false }
    )
    fetchServer(`move/drunkard/${x}/${y}`)
    .then(gameState => this.onNewGameState(gameState))
  }

  moveDriver(direction) {
    let {x, y} = this.wrapAroundMove(
      this.state.gameState.driver,
      direction,
      { stayOnRoad: true }
    )
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
    if (this.state.isLoading || ! imgLoaded(this.mapImage)) {
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
          role: this.state.role,
          ...this.state.gameState,
          joinAsDrunkard: this.joinAsDrunkard.bind(this),
          joinAsDriver: this.joinAsDriver.bind(this),
          moveDrunkard: _.debounce(this.moveDrunkard.bind(this), 100),
          moveDriver: this.moveDriver.bind(this),
          attemptPickup: this.attemptPickup.bind(this),
          confirmPickup: this.confirmPickup.bind(this),
          resetGame: this.resetGame.bind(this),
        })}
        <div className="Footer">
          <div className="Footer-Links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Investors</a>
          </div>
          &copy; 2017 Intaxicated. Please don't drink and drive.
        </div>
      </div>
    )
  }

}

export default Game;
