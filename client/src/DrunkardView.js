import React, { Component } from 'react'
import KeyHandler from 'react-key-handler'
import moment from 'moment'

import WinLoseView from './WinLoseView'

import GameState from './shared/GameState'
import mapImageSrc from './map.svg'

const STUMBLE_TIME = 4000 // seconds
const DIRECTIONS = ['Up', 'Down', 'Right', 'Left']

function chooseRandomElement(collection) {
	return collection[Math.floor(Math.random() * (collection.length - 1))];
}

class DrunkardView extends Component {

  constructor(props) {
    super(props)
    this.mapImage = new Image()
    this.mapImage.src = mapImageSrc
    this.timeLastMoved = moment()
    if (!this.stumbleTimer) {
      this.stumbleTimer = setInterval(this.stumbleIfNeeded.bind(this), 100)
    }
    this.handicaps = {
      teeter: true,
      vomit: false,
      colorblind: false,
      reverse: false,
    }
  }

  componentWillUnmount() {
    clearInterval(this.stumbleTimer)
  }

  move(direction) {
    this.timeLastMoved = moment()
    this.props.moveDrunkard(direction)
  }

  stumbleIfNeeded() {
    if ((moment() - this.timeLastMoved) > STUMBLE_TIME) {
      this.move(chooseRandomElement(DIRECTIONS))
    }
  }

  componentDidUpdate() {
    this.updateTile()
  }

  updateTile() {
    if (!this.canvas) return
    const context = this.canvas.getContext('2d')
    const tileSize = this.mapImage.width / GameState.MAP_SIZE
    const sourceX = tileSize * this.props.drunkard.x
    const sourceY = tileSize * this.props.drunkard.y
    const sourceWidth = tileSize
    const sourceHeight = tileSize
    const destWidth = this.canvas.width
    const destHeight = this.canvas.height
    const destX = 0
    const destY = 0
    // context.filter = 'grayscale(100%)';
    context.drawImage(this.mapImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
  }

  render() {

    // console.log(this.props)
    if (!this.props.drunkard.joined) {
      return (
        <div className='DrunkardView'>
          <button onClick={this.props.joinAsDrunkard}>Ready (drunkard)</button>
        </div>
      )
    }

    if (!this.props.driver.joined) {
      return (
        <div className='DrunkardView'>waiting for driver</div>
      )
    }

    if (this.props.phase === GameState.Phases.GAME_ENDED) {
      return (
        <WinLoseView resetGame={this.props.resetGame} victory={this.props.victory}/>
      )
    }

    return (
      <div className='DrunkardView'>
        <div className='DrunkardView-Controls'>
          <div className='DrunkardView-Controls-Row'>
            <div className='DrunkardView-Timer'>
              Time remaining:
              <div className='DrunkardView-Timer-time'>{GameState.timeRemaining(GameState.ROUND_TIME, this.props.gameStartTime)}</div>
            </div>
          </div>
        </div>
        <div className='DrunkardView-Help'>use <strong>arrow keys</strong> to move</div>
        <canvas className="DrunkardView-Tile" width="500" height="500" ref={canvas => this.canvas = canvas}/>
        {
          DIRECTIONS.map(dir => (
            <KeyHandler
              keyEventName="keydown"
              keyValue={`Arrow${dir}`}
              key={dir}
              onKeyHandle={event => event.preventDefault() || this.move(dir)}
            />
          ))
        }
      </div>
    )
  }

}

export default DrunkardView
