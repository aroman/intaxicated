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
      position: {x: 0, y: 0},
      size: 10,
      imageWidth: 700,
      imageHeight: 600,
    }
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
      <div className="Board">
        {
          ['Up', 'Down', 'Right', 'Left'].map(dir => (
            <KeyHandler
              keyEventName="keydown"
              keyValue={`Arrow${dir}`}
              onKeyHandle={event => event.preventDefault() || this.move(dir)}
            />
          ))
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
