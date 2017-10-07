import 'moment-duration-format'
import Sound from 'react-sound'
import React, { Component } from 'react'
import moment from 'moment'
import HotKey from 'react-shortcut'

import './ChessTimer.css'

const TURN_MAX_SECS = 10
const ROUND_MAX_MINS = 3

class Button extends Component {

  constructor(props) {
    super(props)
    console.log(props)
  }

  render() {
    return (
      <div className="Button" style={{backgroundColor: this.props.color}} onClick={this.props.onClick}>{this.props.time}</div>
    )
  }

}

class ChessTimer extends Component {

  constructor(props) {
    super(props)

    this.state = this.getCleanRoundState()
  }

  getCleanRoundState() {
    return {
      roundTime: moment.duration({minutes: ROUND_MAX_MINS}),
      turnTime: moment.duration({seconds: TURN_MAX_SECS}),
      isPlayerOne: true,
      shouldDing: false,
      shouldBuzz: false,
      roundOver: false,
      roundStarted: false,
    }
  }

  onTick() {
    // No tick if not in game
    if (this.state.roundOver || !this.state.roundStarted) return
    let shouldRoundEnd = false

    // Update timers
    this.state.roundTime.subtract(1, 's')
    this.state.turnTime.subtract(1, 's')

    if (this.state.turnTime.get('seconds') < 1) {
      this.endTurn()
    }
    if (this.state.roundTime.get('minutes') == 0 && this.state.roundTime.get('seconds') == 0) {
      shouldRoundEnd = true
    }
    this.setState({
      roundTime: this.state.roundTime,
      turnTime: this.state.turnTime,
      roundOver: shouldRoundEnd,

    })
  }

  endTurn(playerSkip) {
    this.setState({
      isPlayerOne: !this.state.isPlayerOne,
      turnTime: moment.duration({seconds: TURN_MAX_SECS}),
      shouldDing: playerSkip,
      shouldBuzz: !playerSkip,
    })
    if (playerSkip) {
      setTimeout(() => this.setState({shouldDing: false}), 2000)
    } else {
      setTimeout(() => this.setState({shouldBuzz: false}), 2000)
    }
  }

  fastEndTurn() {
    this.endTurn(true)
  }

  startRound() {
    console.log('startRound')
    this.resetRound()
    this.setState({
      roundStarted: true,
    })
    this.tickInterval = setInterval(this.onTick.bind(this), 1000)
  }

  resetRound() {
    console.log('resetRound')
    console.log(this.state)

    // Unset tick timer if one is set
    if (this.tickInterval) {
      clearInterval(this.tickInterval)
    }

    this.setState(this.getCleanRoundState)
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <HotKey keys={[' ']} onKeysCoincide={this.fastEndTurn.bind(this)}/>
        <HotKey keys={['r']} onKeysCoincide={this.startRound.bind(this)}/>
        {
          this.state.roundStarted ? null :
          <div className="Instructions">press <strong>r</strong> to start game</div>
        }
        {
          this.state.roundStarted ?
          <div className="Game" style={{backgroundColor: this.state.roundOver ? 'red' : 'black'}}>
            <Sound url="buzz.mp3" volume={80} autoLoad={true} playStatus={this.state.shouldBuzz ? 'PLAYING' : 'STOPPED'}/>
            <Sound url="soundtrack.mp4" volume={80} autoLoad={true} playStatus='PLAYING'/>
            <Sound url="ding.wav" autoLoad={true} playStatus={this.state.shouldDing ? 'PLAYING' : 'STOPPED'}/>
            <div className="Timer" >{
              this.state.roundOver ? 'GAME OVER' :
              this.state.roundTime.format("m:ss")
            }</div>
            <Button
              color={this.state.isPlayerOne ? 'blue' : 'green'}
              onClick={this.fastEndTurn.bind(this)}
              time={this.state.turnTime.get('seconds')}
            />
          </div>
          :
          null
        }

      </div>
    )
  }

}

export default ChessTimer;
