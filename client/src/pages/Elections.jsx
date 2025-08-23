import React from 'react'
import { elections as dummyElections } from '../data'
import { useState } from 'react'
import Election from '../components/Election'
import AddElectionModal from '../components/AddElectionModal'
import { useDispatch } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import { useSelector } from 'react-redux'
import UpdateElectionModal from '../components/UpdateElectionModal'

const Elections = () => {

  const [elections, setElections] = useState(dummyElections)

  const dispatch = useDispatch()


  //open add election modal

  const openModal = () => {dispatch(uiActions.openElectionModal())} 
  const electionModalShowing = useSelector(state => state.ui.electionModalShowing)

  const updateElectionModalShowing = useSelector(state => state.ui.updateElectionModalShowing)
  return (
    <>
    <section className="elections">
      <div className="container elections__container">
        <header className="elections__header">
          <h1>Zgjedhjet qe po zhvillohen</h1>
          <button className="btn primary" onClick={openModal} >
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

{ electionModalShowing &&   <AddElectionModal /> }  
{updateElectionModalShowing && <UpdateElectionModal/>}
  </>
  )
}

export default Elections