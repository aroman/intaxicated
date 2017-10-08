const express = require('express')
const path = require('path')
const GameState = require('./client/src/shared/GameState.js')

const app = express()

// Game state
let state = GameState.freshGameState()

const phaseNamed = name => GameState.Phases.indexOf(name)
const inPhase = name => phaseNamed(name) === state.phase
const nextPlayer = player => (player + 1) % state.players.length
const allPlayersAtSameSpotAs = player => state.players.every(({x, y}) => x === player.x && y === player.y)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/state', (req, res) => {
  res.json(state)
})

app.get('/reset', (req, res) => {
  state = GameState.freshGameState()
  res.json(state)
})

app.get('/round/start', (req, res) => {
  if (inPhase('WAIT_FOR_ROUND_START')) {
    state.phase = phaseNamed('IN_ROUND')
  }
  res.json(state)
})

app.get('/round/restart', (req, res) => {
  if (inPhase('ROUND_ENDED')) {
    state.phase = phaseNamed('IN_ROUND')
    state.players = GameState.randomPlayers()
  }
  res.json(state)
})

app.get('/move/:player/:x/:y', (req, res) => {
  const player = Number(req.params.player)
  const x = Number(req.params.x)
  const y = Number(req.params.y)

  if (state.players[player].inTurn) {
    state.players[player].x = x
    state.players[player].y = y
    state.players[player].inTurn = false
    state.players[nextPlayer(player)].inTurn = true
  }

  if (allPlayersAtSameSpotAs(state.players[0])) {
    state.phase = phaseNamed('ROUND_ENDED')
  }

  res.json(state)
})

app.get('/join/:player', (req, res) => {
  const player = Number(req.params.player)
  if (inPhase('WAIT_FOR_PLAYER_1')) {
    state.phase = phaseNamed('WAIT_FOR_PLAYER_2')
  }
  else if (inPhase('WAIT_FOR_PLAYER_2')) {
    state.phase = phaseNamed('WAIT_FOR_ROUND_START')
  }
  res.json(state)
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'+suffix))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Listening on ${port}`)
