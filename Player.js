// Class representing a player in the game
class Player {
  constructor(name) {
    this.name = name
    this.hand = []
  }

  drawCard(deck) {
    this.hand.push(deck.deal())
  }

  playCard(index, discardPile) {
    const card = this.hand.splice(index, 1)[0]
    discardPile.push(card)
    return card
  }
}
module.exports = Player
