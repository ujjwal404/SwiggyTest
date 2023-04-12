// Enum for card suits
const Suit = {
  CLUBS: 'Clubs',
  DIAMONDS: 'Diamonds',
  HEARTS: 'Hearts',
  SPADES: 'Spades',
}

// Enum for card ranks
const Rank = {
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: '10',
  JACK: 'J',
  QUEEN: 'Q',
  KING: 'K',
  ACE: 'A',
}

// Class representing a playing card
class Card {
  constructor(suit, rank) {
    this.suit = suit
    this.rank = rank
  }
}

// Class representing a deck of playing cards
class Deck {
  constructor() {
    this.cards = []
    for (const suit in Suit) {
      for (const rank in Rank) {
        this.cards.push(new Card(Suit[suit], Rank[rank]))
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  deal() {
    return this.cards.pop()
  }
}

module.exports = {
  Suit,
  Rank,
  Card,
  Deck,
}
