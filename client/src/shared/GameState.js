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
      image: 'foo.jpg',
      width: 600,
      height: 400,
      gridSize: 9,
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

module.exports = {

  InitialState,

  freshGameState: () => {
    let state = _.cloneDeep(InitialState)
    const randomCoordinate = () => _.random(0, state.board.gridSize)
    const randomizePlayers = () => state.players.map(player => ({
      x: randomCoordinate(),
      y: randomCoordinate(),
      inTurn: false,
    }))
    const playersCloserThan = (a, b, n) => Math.abs(a.x - b.x) < n && Math.abs(a.y - b.y) < n
    // Euclidean distance. Unclear which algorithm is better.
    // const square = n => Math.pow(n, 2)
    // const playersCloserThan = (a, b, n) => Math.sqrt(square(a.x - b.x) + square(a.y - b.y)) < n
    const noPlayersCloserThan = n => (
      state.players.some((a, i) => (
        state.players.some((b, j) =>
          i !== j && playersCloserThan(a, b, n)
        )
      ))
    )
    while (noPlayersCloserThan(3)) {
      state.players = randomizePlayers()
    }
    state.players[0].inTurn = true
    return state
  },


  Phases: Phases,

}
