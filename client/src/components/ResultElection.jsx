import React, { useEffect, useState } from 'react'
import CandidateRating from './CandidateRating'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Loader from './Loader'

const ResultElection = ({ _id: id, thumbnail, title }) => {
  const [totalVotes, setTotalVotes] = useState(0)
  const [electionCandidates, setElectionCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const currentUser = useSelector(state => state?.vote?.currentVoter)
  const token = currentUser?.token
  const isAdmin = currentUser?.isAdmin === true

  // ✅ admin filters nga Navbar (Redux)
  const county = useSelector(state => state.filters.county)
  const municipality = useSelector(state => state.filters.municipality)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      setIsLoading(true)
      try {
        // ✅ query vetëm per admin
        const params = new URLSearchParams()
        if (isAdmin) {
          if (municipality) params.set("municipality", municipality)
          else if (county) params.set("county", county)
        }

        const qs = params.toString()
        const candidatesUrl =
          `${process.env.REACT_APP_API_URL}/elections/${id}/candidates` +
          (qs ? `?${qs}` : "")
        const resultsUrl =
          `${process.env.REACT_APP_API_URL}/elections/${id}/results`

        const [candidatesRes, resultsRes] = await Promise.all([
          axios.get(candidatesUrl, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(resultsUrl, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const candidates = candidatesRes.data || []
        const results = resultsRes.data || []

        const votesByCandidate = results.reduce((acc, curr) => {
          if (curr && curr.candidateId) {
            acc[String(curr.candidateId)] = curr.totalVotes || 0
          }
          return acc
        }, {})

        const total = results.reduce((sum, r) => sum + (r.totalVotes || 0), 0)

        setTotalVotes(total)
        setElectionCandidates(
          candidates.map(candidate => ({
            ...candidate,
            votes: votesByCandidate[String(candidate._id)] || 0
          }))
        )
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, token, isAdmin, county, municipality])

  return (
    <>
      {isLoading && <Loader />}

      <article className="result">
        <header className="result__header">
          <h4>{title}</h4>
          <div className="result__header-image">
            <img src={thumbnail} alt={title} />
          </div>
        </header>

        <ul className="result__list">
          {electionCandidates.map(candidate => (
            <CandidateRating
              key={candidate._id}
              {...candidate}
              totalVotes={totalVotes}
            />
          ))}
        </ul>

        <Link to={`/elections/${id}/candidates`} className="btn primary full">
          Enter Election
        </Link>
      </article>
    </>
  )
}

export default ResultElection