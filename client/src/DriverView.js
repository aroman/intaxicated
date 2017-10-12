import React, { Component } from 'react'
import KeyHandler from 'react-key-handler'

import GameState from './shared/GameState'
import mapImageSrc from './map.svg'
import WinLoseView from './WinLoseView'
// import iphoneSrc from './iphone.png'

import { getValidDirections } from './MapUtils'

class DriverView extends Component {

  constructor(props) {
    super(props)
    this.mapImage = new Image()
    this.mapImage.src = mapImageSrc
  }

  componentDidMount() {
    this.updateMap()
  }

  componentDidUpdate() {
    this.updateMap()
  }

  updateMap() {
    if (!this.canvas) return
    if (this.mapImage.height !== this.mapImage.width) {
      console.log('invalid map dimensions')
    }
    const context = this.canvas.getContext('2d')
    context.lineWidth = 6
    const outlineOffset = context.lineWidth / 4
    context.drawImage(this.mapImage, 0, 0, this.canvas.height, this.canvas.width)

    const validDirections = getValidDirections(
      this.mapImage,
      this.props.driver.x,
      this.props.driver.y
    )

    // Draw outline around current tile
    context.beginPath()
    const tileSize = this.canvas.height / GameState.MAP_SIZE
    context.rect(
      outlineOffset + this.props.driver.x * tileSize - 2,
      outlineOffset + this.props.driver.y * tileSize,
      tileSize,
      tileSize
    )
    context.strokeStyle = validDirections.up ? 'green' : 'red'
    context.stroke()
  }

  render() {
    if (!this.props.driver.joined) {
      return (
        <div className='DriverView'>
          <button onClick={this.props.joinAsDriver}>Ready (driver)</button>
        </div>
      )
    }

    if (!this.props.drunkard.joined) {
      return (
        <div className='DriverView'>waiting for drunkard</div>
      )
    }

    if (this.props.phase === GameState.Phases.GAME_ENDED) {
      return (
        <WinLoseView resetGame={this.props.resetGame} victory={this.props.victory}/>
      )
    }

    return (
      <div className='DriverView'>
        <div className='DriverView-Controls'>
          <div className='DriverView-Controls-Row'>
          </div>
          <div className='DriverView-Controls-Row'>
            <div className='DriverView-FailedPickups'>
              Failed pickups:
              <div className='DriverView-FailedPickups-count'>{this.props.driver.failedPickups}</div>
            </div>
            <button onClick={this.props.pickup}>Attempt pick-up</button>
          </div>
          <div className='DriverView-Controls-Row'>
            <div className='DriverView-Timer'>
              Time remaining:
              <div className='DriverView-Timer-time'>{GameState.timeRemaining(GameState.ROUND_TIME, this.props.gameStartTime)}</div>
            </div>
          </div>
        </div>
        <div className='DriverView-Help'><strong>arrow keys</strong> to move | <strong>spacebar</strong> to attempt pick-up</div>
        {/* <div className='DriverView-Chasis' src={iphoneSrc}/> */}
        <canvas className="DriverView-Map" width="1000" height="1000" ref={canvas => this.canvas = canvas}/>
        {
          ['Up', 'Down', 'Right', 'Left'].map(dir => (
            <KeyHandler
              keyEventName="keydown"
              keyValue={`Arrow${dir}`}
              key={dir}
              onKeyHandle={event => event.preventDefault() || this.props.moveDriver(dir)}
            />
          ))
        }
        <KeyHandler
          keyEventName="keydown"
          keyValue={' '}
          onKeyHandle={event => event.preventDefault() || this.props.pickup()}
        />
      </div>
    )
  }

}

export default DriverView
