import React, { Component } from 'react'
import _ from 'lodash'
import KeyHandler from 'react-key-handler'

import map from './map.png'

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
      console.log(imageWidth, imageHeight)
      console.log(rows, cols)
    return (
      <div className="Grid" style={{marginTop: -imageHeight}}>
        {
          _.range(rows).map(x => (
            <div className="Grid-Row" key={x}>
              {
                _.range(cols).map(y => (
                    isRevealed(x,y) ?
                    <div
                      key={`${x},${y}`}
                      className='Grid-Square'
                      style={{width: imageWidth / rows, height: imageHeight / cols, background: 'unset'}} />
                    : <div
                      key={`${x},${y}`}
                      className='Grid-Square'
                      style={{width: imageWidth / rows, height: imageHeight / cols, background: 'black'}} />
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }
}


class DriverView extends Component {

  render() {
    return (
      <div className='DriverView'>Driver
        {
          ['Up', 'Down', 'Right', 'Left'].map(dir => (
            <KeyHandler
              keyEventName="keydown"
              keyValue={`Arrow${dir}`}
              key={dir}
              onKeyHandle={event => event.preventDefault() || this.props.move(dir)}
            />
          ))
        }
        <img className="Grid-Map" alt="" src={map} />
        <Grid position={{x: 3, y: 3}} />
      </div>
    )
  }

}

export default DriverView
