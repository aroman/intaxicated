const express = require('express')
const path = require('path')
const _ = require('lodash')
const GameState = require('./client/src/shared/GameState.js')

const app = express()

// Game state
const initialState = () => _.cloneDeep(GameState.InitialState)
let state = initialState()

const phaseNamed = name => GameState.Phases.indexOf(name)
const inPhase = name => phaseNamed(name) === state.phase

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/state', (req, res) => {
  res.json(state)
})

app.get('/reset', (req, res) => {
  state = initialState()
  res.json(state)
})

app.get('/move/:player/:x/:y', (req, res) => {
  const { player, x, y } = req.params
  state.players[player].x = Number(x)
  state.players[player].y = Number(y)
  res.json(state)
})

app.get('/join/:player', (req, res) => {
  const { player } = req.params
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
  res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Listening on ${port}`)
