const Game = require('./Game.js')
const r1 = require('./input')

function askNumberOfPlayers() {
  return new Promise((resolve) => {
    r1.question(
      'Enter the number of players( min-2 and max-4 ): ',
      (answer) => {
        resolve(answer)
      },
    )
  })
}

async function main() {
  let numberOfPlayer = await askNumberOfPlayers()
  while (numberOfPlayer < 2 || numberOfPlayer > 4) {
    console.log('Invalid number of players. Please try again.')
    numberOfPlayer = await askNumberOfPlayers()
  }

  const game = new Game(numberOfPlayer)
  game.start()
  while (!game.winner) {
    // print details of the game state
    console.log(`Current player: ${game.currentPlayer.name}`)
    console.log('Discard pile:')
    for (const card of game.discardPile) {
      // highlight last card
      if (card === game.discardPile[game.discardPile.length - 1]) {
        console.log(`  ${card.rank} of ${card.suit} <---`)
        continue
      }
      console.log(`  ${card.rank} of ${card.suit}`)
    }
    console.log('Your hand:')
    for (let i = 0; i < game.currentPlayer.hand.length; i++) {
      const card = game.currentPlayer.hand[i]
      console.log(`  ${i}: ${card.rank} of ${card.suit}`)
    }

    await game.playCard()

    if (game.winner) {
      break
    }
  }
  rl.close()
  console.log(`${game.winner.name} wins!`)
}
main()
