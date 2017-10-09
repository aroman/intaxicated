import React, { Component } from 'react'
// import _ from 'lodash'
import KeyHandler from 'react-key-handler'

import GameState from './shared/GameState'
import mapImageSrc from './map.png'

// class Grid extends Component {
//
//   render() {
//     const { position } = this.props
//
//     const isRevealed = (x, y) => (x === position.x && y === position.y)
//     return (
//       <div className="Grid">
//         {
//           _.range(rows).map(x => (
//             <div className="Grid-Row" key={x}>
//               {
//                 _.range(cols).map(y => (
//                     isRevealed(x,y) ?
//                     <div
//                       key={`${x},${y}`}
//                       className='Grid-Square'
//                       style={{width: imageWidth / rows, height: imageHeight / cols, background: 'unset'}} />
//                     : <div
//                       key={`${x},${y}`}
//                       className='Grid-Square'
//                       style={{width: imageWidth / rows, height: imageHeight / cols, background: 'black'}} />
//                 ))
//               }
//             </div>
//           ))
//         }
//       </div>
//     )
//   }
// }


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
    return (
      <div className='DriverView'>
        {
          this.props.drunkard.joined ?
          <div>
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
            <canvas className="DriverView-Map" width="1000" height="1000" ref={canvas => this.canvas = canvas}/>
            {/* <Grid position={{x: 3, y: 3}} /> */}
          </div>
          :
          <div>waiting for drunkard</div>
        }
      </div>
    )
  }

}

export default DriverView
