const Phases = [
  'WAIT_FOR_SERVER',
  'WAIT_FOR_PLAYER_1',
  'WAIT_FOR_PLAYER_2',
  'WAIT_FOR_ROUND_START',
  'IN_ROUND',
  'ROUND_ENDED',
]

module.exports = {

  InitialState: {
    board: {
        image: 'foo.jpg',
        width: 600,
        height: 400,
        gridSize: 10,
    },
    players: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
    ],
    phase: 0,
  },

  Phases: Phases,

  phaseDescription: index => Phases[index],

}
