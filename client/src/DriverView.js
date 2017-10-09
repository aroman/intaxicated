import React, { Component } from 'react'
// import _ from 'lodash'
import KeyHandler from 'react-key-handler'

import GameState from './shared/GameState'
import mapImageSrc from './map.png'

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
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.mapImage, 0, 0)
    const tileSize = this.mapImage.width / GameState.MAP_SIZE
    context.beginPath()
    context.rect(this.props.driver.x * tileSize, this.props.driver.y * tileSize, tileSize, tileSize)
    context.strokeStyle = 'red'
    context.lineWidth = 5
    context.stroke()
  }

  render() {
    if (!this.props.driver.joined) {
      return (
        <button onClick={this.props.joinAsDriver}>Ready (driver)</button>
      )
    }
    if (!this.props.drunkard.joined) {
      return (
        <div className='DriverView'>waiting for drunkard</div>
      )
    }
    return (
      <div className='DriverView'>
        <div className='DriverView-Controls'>
          <div className='DriverView-FailedPickups'>
            Failed pickups:
            <div className='DriverView-FailedPickups-count'>{this.props.driver.failedPickups}</div>
          </div>
          <button onClick={this.props.pickup}>Attempt pick-up</button>
        </div>
        <div className='DriverView-Help'>controls: arrow keys = move, spacebar = attempt pick-up</div>
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
