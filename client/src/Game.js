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

// How frequently we poll the server for changes
const POLL_FREQUENCY = 750 // ms
const POLL_TIMEOUT = 1500 // ms
const SERVER_URL = 'http://localhost:5000'

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'))
    }, ms)
    promise.then(resolve, reject)
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

      // Synced with server
      board: {
          image: 'foo.jpg',
          width: 600,
          height: 400,
          gridSize: 10,
      },
      player1: {
          x: 0,
          y: 0,
      },
      player2: {
          x: 0,
          y: 0,
      },
      phase: 0,
    }
    this.onPollTimer()
    setInterval(this.onPollTimer.bind(this), POLL_FREQUENCY)
  }

  onPollTimer() {
    timeout(POLL_TIMEOUT, fetch(`${SERVER_URL}/state`))
    .then(response => response.json())
    .then(gameState => this.onNewGameState(gameState))
    .catch(error => {
      this.setState({isLoading: true})
      console.error(error)
    })
  }

  onNewGameState(nextGameState) {
    this.setState({...nextGameState})
  }

  move(key) {
    let {x, y} = this.state.player1
    if (key === 'Up') y -= 1
    if (key === 'Down') y += 1
    if (key === 'Right') x += 1
    if (key === 'Left') x -= 1
    if (x < 0 || x >= this.state.board.gridSize) return
    if (y < 0 || y >= this.state.board.gridSize) return
    this.setState({player1: {x, y}})
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
          revealed={this.state.player1}
        />
      </div>
    )
  }

}

export default Game;
