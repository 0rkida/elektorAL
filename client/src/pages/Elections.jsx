import React, { useEffect } from 'react'
import { useState } from 'react'
import Election from '../components/Election'
import AddElectionModal from '../components/AddElectionModal'
import { useDispatch } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import { useSelector } from 'react-redux'
import UpdateElectionModal from '../components/UpdateElectionModal'
import axios from 'axios'
import Loader from '../components/Loader'



const Elections = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [elections, setElections] = useState([])

  const dispatch = useDispatch()


  //open add election modal

  const openModal = () => {dispatch(uiActions.openElectionModal())} 

  const token = useSelector(state => state?.vote?.currentVoter?.token)
  const isAdmin = useSelector(
  state => state?.vote?.currentVoter?.isAdmin === true
)

  const electionModalShowing = useSelector(state => state.ui.electionModalShowing)
  const updateElectionModalShowing = useSelector(state => state.ui.updateElectionModalShowing)

  const getElections = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections`
        , {withCredentials: true, headers: {
          Authorization: `Bearer ${token}`
        }})
        setElections(await response.data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
  

      useEffect(() => {
        getElections()
      }, [])

     
  return (
    <>
    <section className="elections">
      <div className="container elections__container">
        <header className="elections__header">
          <h1>Zgjedhjet qe po zhvillohen</h1>
          {isAdmin && <button className="btn primary" onClick={openModal} >
            Krijo nje zgjedhje te re
          </button>}
        </header>

        {isLoading ? <Loader/> : <menu className="elections__menu">
          {
            elections.map((election) => <Election key = {election._id}{...election} />)
          }
        </menu>}
      </div>
    </section>

{ electionModalShowing &&   <AddElectionModal /> }  
{updateElectionModalShowing && <UpdateElectionModal/>}
  </>
  )
}

export default Elections