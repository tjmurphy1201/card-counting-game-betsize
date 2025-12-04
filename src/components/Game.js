import React, { useState } from 'react'

import Footer from './Footer'
import Header from './Header'

const BET_UNIT = 100 // change this to your preferred base unit

const Game = ({ game, actions }) => {
  const { shoe, idx, rand, count, is_visible } = game
  const idxEnd = idx + rand
  const cards = shoe.slice(idx, idxEnd)
  const isOver = idxEnd >= shoe.length

  const [showBetSizing, setShowBetSizing] = useState(false)

  // --- Bet sizing logic ---

  // Approximate decks remaining
  const cardsRemaining = Math.max(shoe.length - idxEnd, 0)
  const decksRemaining = cardsRemaining > 0 ? cardsRemaining / 52 : 0

  const rawTrueCount = decksRemaining > 0 ? count / decksRemaining : 0

  // Floor toward zero
  let trueCount
  if (rawTrueCount > 0) {
    trueCount = Math.floor(rawTrueCount)
  } else {
    trueCount = Math.ceil(rawTrueCount)
  }

  // Units = true count - 1, min 0
  const unitsToBet = Math.max(trueCount - 1, 0)

  const perHandBetTwoHands = unitsToBet * BET_UNIT
  const singleHandBet = Math.round(perHandBetTwoHands * 1.25)

  return (
    <div className='p3 mx-auto' style={{ maxWidth: 600 }}>
      <Header />

      <div className='mb3'>
        {cards.map((c, i) => (
          <img
            key={i}
            alt={c}
            className='mr1'
            src={`${process.env.PUBLIC_URL}/img/cards/${c}.svg`}
            style={{ width: 100, height: 139 }}
          />
        ))}
      </div>

      <div className='mb2'>
        <button
          className='btn btn-primary bg-red'
          onClick={actions.toggleCount}
          style={{ width: 210 }}
        >
          {is_visible ? 'Hide' : 'Show'} running count
        </button>

        {is_visible && (
          <div style={{ display: 'inline-block', marginLeft: 8 }}>
            <span className='ml2 h3 bold align-middle'>{count}</span>

            <button
              className='btn btn-primary bg-black ml2'
              style={{ marginLeft: 8 }}
              onClick={() => setShowBetSizing(!showBetSizing)}
            >
              {showBetSizing ? 'Hide bet sizes' : 'Show bet sizes'}
            </button>
          </div>
        )}
      </div>

      {is_visible && showBetSizing && (
        <div className='mb3'>
          <p className='h5 mb1'>Approx. true count: {trueCount}</p>
          <p className='h5 mb1'>Units to bet (TC - 1): {unitsToBet}</p>
          <p className='h5 mb1'>
            Two hands (adjacent spots):{' '}
            {perHandBetTwoHands > 0
              ? `$${perHandBetTwoHands} per hand`
              : 'Minimum bet only'}
          </p>
          <p className='h5'>
            One hand only (25% more):{' '}
            {singleHandBet > 0 ? `$${singleHandBet}` : 'Minimum bet only'}
          </p>
        </div>
      )}

      <div className='mb2'>
        <button
          className='btn btn-primary bg-black mr2'
          onClick={actions.newGame}
        >
          Reset
        </button>
        <button
          className='btn btn-primary bg-black'
          disabled={isOver}
          onClick={actions.deal}
        >
          More cards →
        </button>
      </div>

      <p className='h5'>
        {isOver
          ? `Nice! You just went through ${shoe.length} cards 🎉`
          : `Cards seen: ${idxEnd} (${shoe.length - idxEnd} remaining)`
        }
      </p>

      <Footer />
    </div>
  )
}

export default Game
