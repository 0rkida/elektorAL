import React, { useEffect, useState } from 'react'
import ResultElection from '../components/ResultElection'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Results = () => {
  const [elections, setElections] = useState([])

  const navigate = useNavigate()

  const currentUser = useSelector(state => state?.vote?.currentVoter)
  const token = currentUser?.token
  const isAdmin = currentUser?.isAdmin === true

  // ✅ filters nga Navbar (Redux)
  const county = useSelector(state => state.filters.county)
  const municipality = useSelector(state => state.filters.municipality)

  // ✅ Access control (mbaje vetem kete)
  useEffect(() => {
    if (!token) navigate("/")
  }, [token, navigate])

  const getElections = async () => {
    if (!token) return

    try {
      // ✅ query vetëm per admin
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
    } catch (err) {
      console.log(err)
    }
  }

  // ✅ rifetch kur ndryshon filter (admin) ose token
  useEffect(() => {
    if (token) getElections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAdmin, county, municipality])

  return (
    <section className="results">
      <div className="container results__container">
        {elections.map(election => (
          <ResultElection key={election._id} {...election} />
        ))}
      </div>
    </section>
  )
}

export default Results