import React, { Component } from 'react'
import KeyHandler from 'react-key-handler'

import map from './map.png'

class DrunkardView extends Component {

  render() {
    return (
      <div className='DrunkardView'>Drunk
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
      </div>
    )
  }

}

export default DrunkardView
