const moment = require('moment')
const _ = require('lodash')

const Phases = [
  'WAIT_FOR_PLAYER_1',
  'WAIT_FOR_PLAYER_2',
  'WAIT_FOR_ROUND_START',
  'IN_ROUND',
  'ROUND_ENDED',
]

const InitialState = {
  phase: 0,
  board: {
      image: 'ispy.jpg',
      gridSize: 10,
  },
  players: [
    {
      x: 0,
      y: 0,
      inTurn: false,
    },
    {
      x: 0,
      y: 0,
      inTurn: false,
    },
  ],
}

function randomPlayers() {
  const randomCoordinate = () => _.random(0, InitialState.board.gridSize - 1)
  const randomizePlayers = () => InitialState.players.map(player => ({
    ...player,
    x: randomCoordinate(),
    y: randomCoordinate(),
  }))
  const playersCloserThan = (a, b, n) => Math.abs(a.x - b.x) < n && Math.abs(a.y - b.y) < n
  // Euclidean distance. Unclear which algorithm is better.
  // const square = n => Math.pow(n, 2)
  // const playersCloserThan = (a, b, n) => Math.sqrt(square(a.x - b.x) + square(a.y - b.y)) < n
  const noPlayersCloserThan = (players, n) => (
    players.some((a, i) => (
      players.some((b, j) =>
        i !== j && playersCloserThan(a, b, n)
      )
    ))
  )
  let players = randomizePlayers()
  while (noPlayersCloserThan(players, 3)) {
    players = randomizePlayers()
  }
  players[0].inTurn = true
  return players
}

module.exports = {

  InitialState,

  randomPlayers,

  freshGameState: () => {
    let state = _.cloneDeep(InitialState)
    state.players = randomPlayers()
    return state
  },

  Phases: Phases,

}
