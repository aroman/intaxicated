import React, { Component } from 'react'
import KeyHandler from 'react-key-handler'

import GameState from './shared/GameState'
import mapImageSrc from './map.png'
import iphoneSrc from './iphone.png'

class DriverView extends Component {

constructor(props) {
  super(props)
  this.mapImage = new Image()
  this.mapImage.src = mapImageSrc
}

  componentDidUpdate() {
    this.updateMap()
  }

  updateMap() {
    if (!this.canvas) return
    const context = this.canvas.getContext('2d')
    const outlineOffset = context.lineWidth / 2
    context.drawImage(this.mapImage, 0, 0, this.canvas.height, this.canvas.width)
    const tileSize = this.canvas.height / GameState.MAP_SIZE
    context.beginPath()
    context.lineWidth = 5
    context.rect(
      outlineOffset + this.props.driver.x * tileSize,
      outlineOffset + this.props.driver.y * tileSize,
      tileSize, tileSize
    )
    context.strokeStyle = 'red'
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
        <div className='DriverView'>
          game over! you { this.props.victory ? 'win' : 'lose' }
          <button onClick={this.props.resetGame}>again?</button>
        </div>
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
        <div className='DriverView-Help'>controls: arrow keys = move, spacebar = attempt pick-up</div>
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
