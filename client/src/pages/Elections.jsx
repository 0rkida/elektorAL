import React from 'react'
import { elections as dummyElections } from '../data'
import { useState } from 'react'
import Election from '../components/Election'

const Elections = () => {

  const [elections, setElections] = useState(dummyElections)
  return (
    <section className="elections">
      <div className="container elections__container">
        <header className="elections__header">
          <h1>Zgjedhjet qe po zhvillohen</h1>
          <button className="btn primary">
            Krijo nje zgjedhje te re
          </button>
        </header>

        <menu className="elections__menu">
          {
            elections.map((election) => <Election key = {election.id}{...election} />)
          }
        </menu>
      </div>
    </section>
  )
}

export default Elections