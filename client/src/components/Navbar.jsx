import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import axios from "axios"
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5"
import { HiOutlineBars3 } from "react-icons/hi2"
import { AiOutlineClose } from "react-icons/ai"
import { useSelector, useDispatch } from 'react-redux'
import { setCounty, setMunicipality } from "../store/filterSlice"

const Navbar = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const [showNav, setShowNav] = useState(window.innerWidth < 600 ? false : true)
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem('elektoral-theme') === 'dark'
  )

 const currentUser = useSelector(state => state?.vote?.currentVoter);
  const token = currentUser?.token
const isAdmin = currentUser?.isAdmin === true;

  const selectedCounty = useSelector(s => s.filters.county)
  const selectedMunicipality = useSelector(s => s.filters.municipality)

  // ✅ Filtrat vetëm në keto faqe
  const showFiltersPages =
    location.pathname.startsWith("/elections") ||
    location.pathname.startsWith("/results")

  const API = process.env.REACT_APP_API_URL

  // Counties & Municipalities (vetem per admin)
  const [counties, setCounties] = useState([])
  const [municipalities, setMunicipalities] = useState([])

  useEffect(() => {
    if (!token || !isAdmin || !showFiltersPages) return

    axios.get(`${API}/counties`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCounties(res.data))
      .catch(err => console.error(err))
  }, [token, isAdmin, showFiltersPages, API])

  useEffect(() => {
    if (!token || !isAdmin || !showFiltersPages) return
    if (!selectedCounty) {
      setMunicipalities([])
      return
    }

    axios.get(`${API}/municipalities/by-county/${selectedCounty}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {console.log("MUNICIPALITIES:", res.data);
    setMunicipalities(res.data);
  })
  .catch(err => console.error("municipalities error:", err));}
  , [token, isAdmin, showFiltersPages, selectedCounty, API])

  const closeNavMenu = () => {
    if (window.innerWidth < 600) setShowNav(false)
  }

  const changeThemeHandler = () => {
    if (darkTheme) {
      localStorage.setItem('elektoral-theme', 'light')
      setDarkTheme(false)
    } else {
      localStorage.setItem('elektoral-theme', 'dark')
      setDarkTheme(true)
    }
  }

  useEffect(() => {
    document.body.className = darkTheme ? 'dark' : 'light'
  }, [darkTheme])

  return (
    <nav>
      <div className="container nav__container">

        <Link to="/" className="nav__logo">elektorAL</Link>

        <div className="nav-right">

          {/* ✅ VOTER: vetem kuti info */}
          {token && !isAdmin && showFiltersPages && (
            <div className="location-box">
              <div>{currentUser?.county?.name}</div>
<div>{currentUser?.municipality?.name}</div>
            </div>
          )}

          {/* ✅ ADMIN: dropdown filters vetem te elections/results */}
          {token && isAdmin && showFiltersPages && (
            <div className="dropdown-wrapper">

              <label>
                Qarku:
                <select
                  value={selectedCounty}
                  onChange={(e) => {
                    dispatch(setCounty(e.target.value)) // reseton bashkine automatikisht ne slice
                    setMunicipalities([])
                  }}
                >
                  <option value="">Te gjitha qarqet</option>
                  {counties.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Bashkia:
                <select
                  value={selectedMunicipality}
                  disabled={!selectedCounty}
                  onChange={(e) => dispatch(setMunicipality(e.target.value))}
                >
                  <option value="">Te gjitha bashkite</option>
                  {municipalities.map((m) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </label>

            </div>
          )}

          {token && showNav && (
            <menu>
              <NavLink to="/elections" onClick={closeNavMenu}>Zgjedhje</NavLink>
              <NavLink to="/results" onClick={closeNavMenu}>Rezultate</NavLink>
              <NavLink to="/logout" onClick={closeNavMenu}>Log out</NavLink>
            </menu>
          )}

          <button className="theme__toggle-btn" onClick={changeThemeHandler}>
            {darkTheme ? <IoSunnyOutline /> : <IoMoonOutline />}
          </button>

          <button className="nav__toggle-btn" onClick={() => setShowNav(!showNav)}>
            {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar