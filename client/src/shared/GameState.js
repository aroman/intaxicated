const moment = require('moment')
const _ = require('lodash')

const MAP_SIZE = 10
const ROUND_TIME = 3 // minutes
const MAX_PICKUP_ATTEMPTS = 3

const Phases = {
  WAIT_FOR_PLAYERS: 'WAIT_FOR_PLAYERS',
  IN_GAME: 'IN_GAME',
  GAME_ENDED: 'GAME_ENDED',
}

const InitialState = {
  phase: Phases.WAIT_FOR_PLAYERS,
  driver: {
    x: 0,
    y: 0,
    joined: false,
    failedPickups: 0,
  },
  drunkard: {
    x: 0,
    y: 0,
    joined: false,
  },
  victory: false,
  attemptingPickup: false,
  gameStartTime: 0,
}

const randomCoordinate = () => _.random(0, MAP_SIZE - 1)

//
// function randomLocations() {
//   const randomPlayers = () => .map(player => ({
//     x: randomCoordinate(),
//     y: randomCoordinate(),
//   }))
//   const playersCloserThan = (a, b, n) => Math.abs(a.x - b.x) < n && Math.abs(a.y - b.y) < n
//   // Euclidean distance. Unclear which algorithm is better.
//   // const square = n => Math.pow(n, 2)
//   // const playersCloserThan = (a, b, n) => Math.sqrt(square(a.x - b.x) + square(a.y - b.y)) < n
//   const noPlayersCloserThan = (players, n) => (
//     players.some((a, i) => (
//       players.some((b, j) =>
//         i !== j && playersCloserThan(a, b, n)
//       )
//     ))
//   )
//   let players = randomizePlayers()
//   while (noPlayersCloserThan(players, 3)) {
//     players = randomizePlayers()
//   }
//   players[0].inTurn = true
//   return players
// }

module.exports = {

  timeRemaining: (minutes, epoch) => {
    const now = moment().subtract(minutes, 'minutes')
    const then = moment(epoch)
    const remaining = moment.utc(then.diff(now))
    if (remaining.minutes() > minutes) {
      return '0:00'
    }
    return remaining.format('m:ss')
  },

  MAP_SIZE,
  ROUND_TIME,
  MAX_PICKUP_ATTEMPTS,

  InitialState,

  freshGameState: () => {
    let state = _.cloneDeep(InitialState)
    state.driver.x = randomCoordinate()
    state.driver.y = randomCoordinate()
    state.drunkard.x = randomCoordinate()
    state.drunkard.y = randomCoordinate()
    return state
  },

  Phases: Phases,

}
