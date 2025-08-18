import React from 'react'
import { candidates as dummyCandidates } from '../data'
import { useParams } from 'react-router-dom' 
import Candidate from '../components/Candidate'

const Candidates = () => {

  const {id} = useParams()


  //get candidates that belong to the election with the given id
  const candidates = dummyCandidates.filter(candidate => candidate.election === id)

   return (
    <section className="candidates">
      <header className="candidates__header">
        <h1>Voto kandidatin tënd </h1>
        <p>Këta janë kandidatët për këto zgjedhje. Ju ftojmë të votoni një herë me qetësi dhe përgjegjësi, 
          duke siguruar që çdo votë të ketë vlerën e saj.</p>
      </header>

      <div className="container candidates__container">
        {
          candidates.map(candidate => <Candidate key = {candidate.id} {...candidate} />)
        }


      </div>
    </section>
  )
}

export default Candidates