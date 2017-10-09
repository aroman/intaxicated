const express = require('express')
const path = require('path')
const {Phases, freshGameState, timeRemaining, ROUND_TIME} = require('./client/src/shared/GameState.js')

const app = express()

// Game state
let state = freshGameState()

const inPhase = phase => state.phase === phase
// const nextState = curState => {
//   if (curState.phase === Phases.WAIT_FOR_PLAYERS) {
//     if (curState.drunkard.joined && curState.driver.join) {
//       next
//     }
//   }
// }

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/state', (req, res) => {
  if (state.phase === Phases.IN_GAME && timeRemaining(ROUND_TIME, state.gameStartTime) === '0:00') {
    state.phase = Phases.GAME_ENDED
  }
  res.json(state)
})

app.get('/reset', (req, res) => {
  state = freshGameState()
  res.json(state)
})

app.get('/move/driver/:x/:y', (req, res) => {
  state.driver.x = Number(req.params.x)
  state.driver.y = Number(req.params.y)
  res.json(state)
})

app.get('/move/drunkard/:x/:y', (req, res) => {
  state.drunkard.x = Number(req.params.x)
  state.drunkard.y = Number(req.params.y)
  res.json(state)
})

app.get('/pickup', (req, res) => {
  if (state.drunkard.x === state.driver.x && state.driver.y === state.drunkard.y) {
    state.phase = Phases.GAME_ENDED
    state.victory = true
  } else {
    state.driver.failedPickups += 1
  }
  res.json(state)
})

app.get('/join/driver', (req, res) => {
  state.driver.joined = true
  if (state.drunkard.joined && state.driver.joined) {
    state.phase = Phases.IN_GAME
    state.gameStartTime = Date.now()
  }
  res.json(state)
})

app.get('/join/drunkard', (req, res) => {
  state.drunkard.joined = true
  if (state.drunkard.joined && state.driver.joined) {
    state.phase = Phases.IN_GAME
    state.gameStartTime = Date.now()
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
