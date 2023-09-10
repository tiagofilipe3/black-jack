import { useEffect, useState } from 'react'
import { TCard } from '../Card/types.ts'
import {
  ActionButtons,
  GameBoardContainer,
  Hand,
  StyledButton as Button,
} from './styles.ts'
import Card from '../Card'
import { Flex } from 'rebass'

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

  const generateShuffledDeckAndDealInitialCards = () => {
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
    } else if (dealerValue > 21 || playerValue > dealerValue) {
      setWinner('Player')
    } else if (playerValue === dealerValue) {
      setWinner('Draw')
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
      // TODO: end game
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
    generateShuffledDeckAndDealInitialCards()
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="center">
        <h3>Black Jack</h3>
        {(winner && winner !== 'Draw' && <h4>{winner} wins!</h4>) || (
          <h4>
            {secondsRemaining > 0
              ? secondsRemaining
              : `Let's play ${playerName}!`}
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
          <Hand>
            {dealerHand.length > 0 &&
              dealerHand.map((card) => <Card card={card} />)}
          </Hand>
          <Hand>
            {playerHand.length > 0 &&
              playerHand.map((card) => <Card card={card} />)}
          </Hand>
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
