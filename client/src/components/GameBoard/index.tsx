import { useEffect, useState } from 'react'
import { TCard } from '../Card/types.ts'
import {
  ActionButtons,
  GameBoardContainer,
  Hand,
  Scoreboard,
  StyledButton as Button,
} from './styles.ts'
import Card from '../Card'
import { Box, Flex } from 'rebass'
import { TScoreboard } from './types.ts'

const GameBoard = ({
  countdown,
  playerName,
}: {
  countdown: number
  playerName: string
}) => {
  const [deck, setDeck] = useState<TCard[]>([])
  const [playerHand, setPlayerHand] = useState<TCard[]>([])
  const [dealerHand, setDealerHand] = useState<TCard[]>([])
  const [winner, setWinner] = useState<
    'Player' | 'Dealer' | 'Draw' | undefined
  >(undefined)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(countdown)
  const [scoreboard, setScoreboard] = useState({ dealer: 0, player: 0 })

  useEffect(() => {
    const getScoreboard = async () => {
      const res = await fetch('/scoreboard', { method: 'GET' })
      const scoreboard: TScoreboard = await res.json()

      setScoreboard(scoreboard)
    }

    getScoreboard()
  }, [winner])

  const generateShuffledDeckAndDealInitialCards = async () => {
    const res = await fetch('/getShuffledDeck')
    const decks = await res.json()

    const playerInitialCards = [decks.pop(), decks.pop()].filter(
      (card) => card !== undefined
    ) as TCard[]
    const dealerInitialCards = [decks.pop(), decks.pop()].filter(
      (card) => card !== undefined
    ) as TCard[]

    setPlayerHand(playerInitialCards)
    setDealerHand([
      dealerInitialCards[0],
      { ...dealerInitialCards[1], hidden: true },
    ])
    setDeck(decks)
  }

  useEffect(() => {
    generateShuffledDeckAndDealInitialCards()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining((prev) => prev - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsRemaining])

  const calculateHandValue = (hand: TCard[]): number => {
    let value = 0
    let aceCount = 0

    for (const card of hand) {
      if (card.rank === 'A') {
        // If adding 11 doesn't bust the hand, count the Ace as 11
        if (value + 11 <= 21) {
          value += 11
          aceCount++
        } else {
          // Otherwise, count the Ace as 1
          value += 1
        }
      } else if (['K', 'Q', 'J'].includes(card.rank)) {
        value += 10
      } else {
        value += parseInt(card.rank)
      }
    }

    // Handle aces
    while (value > 21 && aceCount > 0) {
      value -= 10
      aceCount--
    }

    return value
  }

  const determineRoundWinner = () => {
    const playerValue = calculateHandValue(playerHand)
    const dealerValue = calculateHandValue(dealerHand)

    if (playerValue > 21 || (dealerValue <= 21 && dealerValue >= playerValue)) {
      setWinner('Dealer')
      console.log({ winner: dealerHand })
    } else if (dealerValue > 21 || playerValue > dealerValue) {
      setWinner('Player')
      console.log({ winner: playerHand })
    } else if (playerValue === dealerValue) {
      setWinner('Draw')
      console.log({ draw: playerHand })
    }
  }

  const dealCardFromDeck = (): TCard | undefined => {
    if (deck.length === 0) {
      setWinner('Draw')
      return undefined
    }

    const newDeck = [...deck]
    const card = newDeck.pop()
    setDeck(newDeck)

    return card
  }

  const handleHit = () => {
    const newCard = dealCardFromDeck()
    if (newCard) {
      setPlayerHand((prevHand) => [...prevHand, newCard])
    } else {
      setWinner('Draw')
    }
  }

  const handleStay = () => {
    const dealerHandCopy = [...dealerHand]

    // Implement dealer's logic (e.g., keep drawing cards until value >= 17)
    while (calculateHandValue(dealerHandCopy) < 17) {
      const newCard = dealCardFromDeck()

      if (newCard) {
        dealerHandCopy.push(newCard)
      } else {
        setDealerHand(dealerHandCopy)
        setWinner('Draw')
        break
      }
    }

    // Reveal the dealer's hidden card
    setDealerHand(
      dealerHandCopy.map((card) =>
        card.hidden ? { ...card, hidden: false } : card
      )
    )

    // Determine the round winner
    determineRoundWinner()
  }

  const handleNewGame = () => {
    setPlayerHand([])
    setDealerHand([])
    setWinner(undefined)
    setSecondsRemaining(countdown)
    generateShuffledDeckAndDealInitialCards()
  }

  return (
    <>
      <Scoreboard>
        <Box mb="10px">Scoreboard</Box>
        <Flex flexDirection="column">
          <Flex mb="5px" justifyContent="space-between">
            <Flex>Dealer</Flex>
            <Flex>10</Flex>
          </Flex>
          <Flex justifyContent="space-between">
            <Flex>Player</Flex>
            <Flex>15</Flex>
          </Flex>
        </Flex>
      </Scoreboard>
      <Flex flexDirection="column" alignItems="center">
        <h3>Black Jack</h3>
        {(winner && winner !== 'Draw' && <h4>{winner} wins!</h4>) || (
          <h4>
            {secondsRemaining > 0
              ? secondsRemaining
              : `Hi ${playerName}! Let's play!`}
          </h4>
        )}
      </Flex>
      <GameBoardContainer>
        <Flex
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
          mb="15px"
          alignItems="center"
        >
          <Flex flexDirection="column">
            <Box mt="10px" mb="10px">
              Dealer
            </Box>
            <Hand>
              {dealerHand.length > 0 &&
                dealerHand.map((card) => <Card card={card} />)}
            </Hand>
          </Flex>
          <Flex flexDirection="column">
            <Box mt="30px" mb="10px">
              Player
            </Box>
            <Hand>
              {playerHand.length > 0 &&
                playerHand.map((card) => <Card card={card} />)}
            </Hand>
          </Flex>
        </Flex>
        <ActionButtons>
          <Flex>
            <Button
              onClick={handleHit}
              disabled={!!winner || secondsRemaining > 0}
            >
              Hit
            </Button>
            <Button
              onClick={handleStay}
              disabled={!!winner || secondsRemaining > 0}
            >
              Stay
            </Button>
          </Flex>
          <Flex mt="10px">
            <Button
              onClick={handleNewGame}
              disabled={!winner || secondsRemaining > 0}
            >
              New game
            </Button>
          </Flex>
        </ActionButtons>
      </GameBoardContainer>
    </>
  )
}

export default GameBoard
