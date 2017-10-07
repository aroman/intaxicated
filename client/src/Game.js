import 'moment-duration-format'
// import classNames from 'class-names'
import _ from 'lodash'
import React, { Component } from 'react'
// import moment from 'moment'

import KeyHandler from 'react-key-handler'
import background from './scifi.jpg'
import maskTile from './mask.png'
import blackTile from './blackTile.png'
import './Game.css'

import state from './shared/state.js'

// How frequently we poll the server for changes
const POLL_FREQUENCY = 150 // ms
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
    alert('Whoops! The game broke. Check the error console.')
    console.error(error)
  })
}

const phaseDescription = index => ([
  'WAIT_FOR_SERVER',
  'WAIT_FOR_PLAYER_1',
  'WAIT_FOR_PLAYER_2',
  'WAIT_FOR_ROUND_START',
  'IN_ROUND',
  'ROUND_ENDED',
][index])

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
    return (
      <div className="Grid" style={{marginTop: -imageHeight}}>
        {
          _.range(rows).map(x => (
            <div className="Grid-Row" key={x}>
              {
                _.range(cols).map(y => (
                    isRevealed(x,y) ?
                    <img
                      alt=''
                      src={maskTile}
                      key={`${x},${y}`}
                      className='Grid-Square'
                      style={ {width: imageWidth / rows, height: imageHeight / cols}} />
                    : <img
                      alt=''
                      key={`${x},${y}`}
                      src={blackTile}
                      className='Grid-Square'
                      style={ {width: imageWidth / rows, height: imageHeight / cols}} />
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }
}

class Game extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // Local
      debug: false,
      playerNum: document.location.search.includes('1') ? 1 : 0,

      ...state.InitialState,
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

  render() {
    const imageHeight = this.state.board.height
    const imageWidth = this.state.board.width
    return (
      <div className="Game">
        <KeyHandler
          keyEventName="keydown"
          keyValue='`'
          onKeyHandle={() => this.setState({debug: !this.state.debug})}
        />
        {
          ['Up', 'Down', 'Right', 'Left'].map(dir => (
            <KeyHandler
              keyEventName="keydown"
              keyValue={`Arrow${dir}`}
              key={dir}
              onKeyHandle={event => event.preventDefault() || this.move(dir)}
            />
          ))
        }
        {
          !this.state.debug ? null :
          <div className="Debug">
            <pre className="Debug-Phase">{phaseDescription(this.state.phase)}</pre>
            <pre className="Debug-State">{JSON.stringify(this.state, null, 2)}</pre>
          </div>
        }
        <div className="Title">Tunnel Vision</div>
        <img className="Grid-Image" alt='' src={background} style={{width: imageWidth, height: imageHeight}}/>
        <Grid
          rows={this.state.board.gridSize}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          cols={this.state.board.gridSize}
          revealed={this.getLocalPlayer()}
        />
      </div>
    )
  }

}

export default Game;
