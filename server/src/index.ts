// server/index.js
import { TCard } from './types.js'

import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch';

//json-server
import jsonServer from 'json-server'
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const app = express();
const port = 3001;

server.use(middlewares)
server.use(router)
server.listen(3002, () => {
  console.log('JSON Server is running')
})

app.use(cors())
app.get('/getShuffledDeck', (request, response) => {
  const ranks = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ]
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
  const decks: TCard[] = []

  // Create 6 decks
  for (let deckIndex = 0; deckIndex < 6; deckIndex++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        decks.push({ rank, suit })
      }
    }
  }

  // Shuffle the decks using Fisher-Yates algorithm
  for (let i = decks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[decks[i], decks[j]] = [decks[j], decks[i]]
  }

  response.send(decks)
})

app.get('/scoreboard', async (request, response) => {
  const res = await fetch('http://localhost:3002/scoreboard', { method: 'GET' })
  const scoreboard = await res.json()

  response.send(scoreboard)
})

app.put('/scoreboard', async (request, response) => {

})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
