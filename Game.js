// Class representing the game
const Player = require('./Player')
const { Rank, Deck } = require('./constants')
const r1 = require('./input')

function askQuestion() {
  return new Promise((resolve) => {
    r1.question('Enter the index of card you want to play ', (answer) => {
      resolve(answer)
    })
  })
}

class Game {
  constructor(numPlayers) {
    this.players = []
    for (let i = 1; i <= numPlayers; i++) {
      this.players.push(new Player(`Player ${i}`))
    }
    this.deck = new Deck()
    this.discardPile = []
    this.currentPlayerIndex = 0
    this.direction = 1 // 1 for clockwise, -1 for counterclockwise
    this.drawCount = 0
    this.actionRank = null
    this.winner = null
  }

  start() {
    this.deck.shuffle()
    // players start with 5 cards
    for (let i = 0; i < 5; i++) {
      for (const player of this.players) {
        player.drawCard(this.deck)
      }
    }
    const topCard = this.deck.deal()
    this.discardPile.push(topCard)

    this.currentPlayer = this.players[this.currentPlayerIndex]
  }

  async playCard() {
    const currentPlayer = this.players[this.currentPlayerIndex]
    //* draw cards acc to prev action
    if (this.drawCount > 0) {
      for (let i = 0; i < this.drawCount; i++) {
        currentPlayer.drawCard(this.deck)
      }
      this.drawCount = 0

      //* print new hand
      console.log(`\nYour hand after drawing cards:`)
      for (let i = 0; i < currentPlayer.hand.length; i++) {
        console.log(
          `${i}: ${currentPlayer.hand[i].rank} of ${currentPlayer.hand[i].suit}`,
        )
      }
    }

    //* check if player has any playable card
    const topCard = this.discardPile[this.discardPile.length - 1]
    let playableCards = this.checkPlayableCards()
    if (playableCards.length === 0) {
      // If the player has no playable cards, they must draw a card
      currentPlayer.drawCard(this.deck)
      if (this.deck.cards.length === 0) {
        // If the draw pile is empty, the game ends in a draw
        return
      }
      console.log(`${currentPlayer.name} drew a card`)
      console.log(
        '------------------------------------------------------------------',
      )
      // next player's turn
      this.currentPlayerIndex =
        (this.currentPlayerIndex + this.direction) % this.players.length
      if (this.currentPlayerIndex < 0) {
        this.currentPlayerIndex += this.players.length
      }
      this.currentPlayer = this.players[this.currentPlayerIndex]
      return
    }

    //* Ask user to play a card
    let index = await askQuestion()

    while (!playableCards.includes(parseInt(index))) {
      console.log('Invalid card. Please try again.')
      index = await askQuestion()
    }

    //* play the card
    const card = currentPlayer.playCard(index, this.discardPile)
    console.log(`${currentPlayer.name} played ${card.rank} of ${card.suit}`)

    //* check if player has won
    if (currentPlayer.hand.length === 0) {
      // If the player has no cards left, they win the game
      this.winner = currentPlayer
      return
    }

    console.log(
      '------------------------------------------------------------------',
    )
    //* check if the card is an action card
    if (card.rank === Rank.JACK) {
      this.actionRank = Rank.JACK
      this.drawCount = 4
    } else if (card.rank === Rank.QUEEN) {
      this.actionRank = Rank.QUEEN
      this.drawCount = 2
    } else if (card.rank === Rank.KING) {
      this.direction *= -1
    } else if (card.rank === Rank.ACE) {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + this.direction) % this.players.length
      if (this.currentPlayerIndex < 0) {
        this.currentPlayerIndex += this.players.length
      }
    }

    //* next player's turn
    this.currentPlayerIndex =
      (this.currentPlayerIndex + this.direction) % this.players.length
    if (this.currentPlayerIndex < 0) {
      this.currentPlayerIndex += this.players.length
    }

    this.currentPlayer = this.players[this.currentPlayerIndex]
  }

  getcurrentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  checkPlayableCards() {
    const topCard = this.discardPile[this.discardPile.length - 1]
    const currentPlayer = this.players[this.currentPlayerIndex]
    let playableCards = []
    for (let i = 0; i < currentPlayer.hand.length; i++) {
      const card = currentPlayer.hand[i]
      //* Action cards are not stackable
      if (
        (topCard.rank === Rank.Jack ||
          topCard.rank === Rank.Queen ||
          topCard.rank === Rank.King ||
          topCard.rank === Rank.Ace) &&
        (card.rank === Rank.Jack ||
          card.rank === Rank.Queen ||
          card.rank === Rank.King ||
          card.rank === Rank.Ace)
      ) {
        continue
      }
      if (card.rank === topCard.rank || card.suit === topCard.suit) {
        playableCards.push(i)
      }
    }
    return playableCards
  }
}

module.exports = Game
