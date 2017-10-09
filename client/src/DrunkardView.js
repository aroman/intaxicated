import React, { Component } from 'react'
import KeyHandler from 'react-key-handler'

import GameState from './shared/GameState'
import mapImageSrc from './map.png'

class DrunkardView extends Component {

  constructor(props) {
    super(props)
    this.mapImage = new Image()
    this.mapImage.src = mapImageSrc
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
    const destWidth = tileSize
    const sourceHeight = tileSize
    const destHeight = tileSize
    const destX = 0
    const destY = 0
    context.drawImage(this.mapImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
  }

  render() {
    return (
      <div className='DrunkardView'>
        {
          this.props.drunkard.joined ?
          <div>
            {
              ['Up', 'Down', 'Right', 'Left'].map(dir => (
                <KeyHandler
                  keyEventName="keydown"
                  keyValue={`Arrow${dir}`}
                  key={dir}
                  onKeyHandle={event => event.preventDefault() || this.props.moveDrunkard(dir)}
                />
              ))
            }
            <canvas className="DrunkardView-Tile" width="100" height="100" ref={canvas => this.canvas = canvas}/>
          </div>
          :
          <button onClick={this.props.joinAsDrunkard}>Ready (drunk)</button>
        }
      </div>
    )
  }

}

export default DrunkardView
