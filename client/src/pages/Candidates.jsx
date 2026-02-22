import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Candidate from '../components/Candidate'
import ConfirmVote from '../components/ConfirmVote'
import axios from 'axios'

const Candidates = () => {
  const navigate = useNavigate()
  const { id: selectedElection } = useParams()

  const [candidates, setCandidates] = useState([])
  const [canVote, setCanVote] = useState(true)

  const currentUser = useSelector(state => state?.vote?.currentVoter)
  const token = currentUser?.token
  const isAdmin = currentUser?.isAdmin === true

  const votedElections = currentUser?.votedElections || []
  const voteCandidateModalShowing = useSelector(state => state.ui.voteCandidateModalShowing)

  // ✅ Admin filters nga Navbar
  const county = useSelector(state => state.filters.county)
  const municipality = useSelector(state => state.filters.municipality)

  // ✅ Access control
  useEffect(() => {
    if (!token) navigate("/")
  }, [token, navigate])

  // ✅ check if voter has already voted
  useEffect(() => {
    if (votedElections.includes(selectedElection)) setCanVote(false)
    else setCanVote(true)
  }, [votedElections, selectedElection])

  const getCandidates = async () => {
    if (!token) return

    try {
      // ✅ query vetëm per admin
      const params = new URLSearchParams()
      if (isAdmin) {
        if (municipality) params.set("municipality", municipality)
        else if (county) params.set("county", county)
      }

      const qs = params.toString()
      const url =
        `${process.env.REACT_APP_API_URL}/elections/${selectedElection}/candidates` +
        (qs ? `?${qs}` : "")

      const response = await axios.get(url, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      })

      setCandidates(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  // ✅ Rifetch kur ndryshon election ose filtrat (admin)
  useEffect(() => {
    getCandidates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElection, token, isAdmin, county, municipality])

  return (
    <>
      <section className="candidates">
        {!canVote ? (
          <header className="candidates__header">
            <h1>Ju keni votuar tashme</h1>
            <p>
              Ju lejoheni te votoni vetem nje here ne kete zgjedhje. Ju lutem votoni ne nje zgjedhje tjeter ose mbylleni procesin e votimit.
            </p>
          </header>
        ) : (
          <>
            {candidates.length > 0 ? (
              <header className="candidates__header">
                <h1>Voto kandidatin tënd</h1>
                <p>
                  Këta janë kandidatët për këto zgjedhje. Ju ftojmë të votoni një herë me qetësi dhe përgjegjësi, duke siguruar që çdo votë të ketë vlerën e saj.
                </p>
              </header>
            ) : (
              <header className="candidates__header">
                <h1>Zgjedhje Joaktive</h1>
                <p>Nuk u gjeten kandidate per kete zgjedhje, ju lutemi provojeni me vone.</p>
              </header>
            )}

            <div className="container candidates__container">
              {candidates.map(candidate => (
                <Candidate key={candidate._id} {...candidate} />
              ))}
            </div>
          </>
        )}
      </section>

      {voteCandidateModalShowing && (
        <ConfirmVote selectedElection={selectedElection} />
      )}
    </>
  )
}

export default Candidates