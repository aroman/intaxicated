import React, { Component } from 'react'
// import _ from 'lodash'
import KeyHandler from 'react-key-handler'

import map from './map.png'

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
            <img className="Grid-Map" alt="" src={map} />
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
