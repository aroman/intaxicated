const express = require('express')
const path = require('path');
const State = require('./client/src/shared/state.js')

const app = express()

let state = State.InitialState

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/state', (req, res) => {
  res.json(state)
})

app.get('/move/:player/:x/:y', (req, res) => {
  const { player, x, y } = req.params
  state.players[player].x = Number(x)
  state.players[player].y = Number(y)
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
