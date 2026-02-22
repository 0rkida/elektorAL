import React, { useEffect, useState } from 'react'
import Election from '../components/Election'
import AddElectionModal from '../components/AddElectionModal'
import UpdateElectionModal from '../components/UpdateElectionModal'
import Loader from '../components/Loader'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import { useNavigate } from 'react-router-dom'



const Elections = () => {
 
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [elections, setElections] = useState([])
  const county = useSelector(state => state.filters.county)
  const municipality = useSelector(state => state.filters.municipality)

  
  //open add election modal

  const openModal = () => {dispatch(uiActions.openElectionModal())} 

  const token = useSelector(state => state?.vote?.currentVoter?.token)
  const isAdmin = useSelector(
  state => state?.vote?.currentVoter?.isAdmin === true
)

  const electionModalShowing = useSelector(state => state.ui.electionModalShowing)
  const updateElectionModalShowing = useSelector(state => state.ui.updateElectionModalShowing)

    // ✅ Access control (fix deps)
  useEffect(() => {
    if (!token) navigate("/")
  }, [token, navigate])


    const getElections = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      // ✅ query vetëm për admin
      const params = new URLSearchParams()
      if (isAdmin) {
        if (municipality) params.set("municipality", municipality)
        else if (county) params.set("county", county)
      }

      const qs = params.toString()
      const url = `${process.env.REACT_APP_API_URL}/elections${qs ? `?${qs}` : ""}`

      const response = await axios.get(url, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      })

      setElections(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ rifetch kur ndryshon filtri (admin)
  useEffect(() => {
    getElections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAdmin, county, municipality])

  return (
    <>
      <section className="elections">
        <div className="container elections__container">
          <header className="elections__header">
            <h1>Zgjedhjet qe po zhvillohen</h1>
            {isAdmin && (
              <button className="btn primary" onClick={openModal}>
                Krijo nje zgjedhje te re
              </button>
            )}
          </header>

          {isLoading ? (
            <Loader />
          ) : (
            <menu className="elections__menu">
              {elections.map((election) => (
                <Election key={election._id} {...election} />
              ))}
            </menu>
          )}
        </div>
      </section>

      {electionModalShowing && <AddElectionModal />}
      {updateElectionModalShowing && <UpdateElectionModal />}
    </>
  )
}

export default Elections