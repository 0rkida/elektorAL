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
    const fetchCandidates = async () => {
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
        const url =
          `${process.env.REACT_APP_API_URL}/elections/${id}/candidates` +
          (qs ? `?${qs}` : "")

        const res = await axios.get(url, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })

        setElectionCandidates(res.data)

        const total = res.data.reduce((sum, c) => sum + (c.voteCount || 0), 0)
        setTotalVotes(total)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidates()
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