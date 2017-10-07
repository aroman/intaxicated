import 'moment-duration-format'
import Sound from 'react-sound'
import classNames from 'class-names'
import _ from 'lodash'
import React, { Component } from 'react'
import moment from 'moment'

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

    const isRevealed = (x, y) => (x == revealed.x && y == revealed.y)
    return (
      <div className="Grid" style={{marginTop: -imageHeight}}>
        {
          _.range(rows).map(x => (
            <div className="Grid-Row">
              {
                _.range(cols).map(y => (
                    isRevealed(x,y) ?
                    <img
                      src={maskTile}
                      className='Grid-Square'
                      style={ {width: imageWidth / rows, height: imageHeight / cols}} />
                    : <img
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
      debug: false,
      board: {
          image: 'foo.jpg',
          width: 500,
          height: 400,
          gridSize: 10,
      },
      player1: {
          x: 3,
          y: 2,
      },
      player2: {
          x: 3,
          y: 0
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
    let {x, y} = this.state.position
    if (key == 'Up') y -= 1
    if (key == 'Down') y += 1
    if (key == 'Right') x += 1
    if (key == 'Left') x -= 1
    if (x < 0 || x >= this.state.size) return
    if (y < 0 || y >= this.state.size) return
    this.setState({position: {x, y}})
  }

  render() {
    const imageHeight = this.state.imageHeight
    const imageWidth = this.state.imageWidth
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
        <img className="Grid-Image" src={background} style={{width: imageWidth, height: imageHeight}}/>
        <Grid
          rows={this.state.size}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          cols={this.state.size}
          revealed={this.state.position}
        />
      </div>
    )
  }

}

export default Game;
