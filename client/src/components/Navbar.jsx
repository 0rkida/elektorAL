import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from "axios";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const location = useLocation();

  const [showNav, setShowNav] = useState(window.innerWidth < 600 ? false : true);
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem('elektoral-theme') === 'dark'
  );

  // Dropdown visibility
  const hideDropdown = location.pathname === "/login" || 
                       location.pathname === "/register" || 
                       location.pathname === "/";

  // Counties & Municipalities
  const [counties, setCounties] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  // Fetch counties from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/counties")
      .then(res => setCounties(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch municipalities when county changes
  useEffect(() => {
    if (!selectedCounty) return;

    axios.get(`http://localhost:5000/api/municipalities/by-county/${selectedCounty}`)
      .then(res => setMunicipalities(res.data))
      .catch(err => console.error(err));
  }, [selectedCounty]);

  // Navbar functions
  const closeNavMenu = () => {
    if (window.innerWidth < 600) setShowNav(false);
  };

  const changeThemeHandler = () => {
    if (darkTheme) {
      localStorage.setItem('elektoral-theme', 'light');
      setDarkTheme(false);
    } else {
      localStorage.setItem('elektoral-theme', 'dark');
      setDarkTheme(true);
    }
  };

  useEffect(() => {
    document.body.className = darkTheme ? 'dark' : 'light';
  }, [darkTheme]);


  return (
    <nav>
      <div className="container nav__container">

        <Link to="/" className="nav__logo">elektorAL</Link>

        <div className="nav-right">
           {/* Dropdown: County & Municipality */}
          {!hideDropdown && (
            <div className="dropdown-wrapper">

              {/* County */}
              <label>
                Qarku:
                <select
                  value={selectedCounty}
                  onChange={(e) => {
                    setSelectedCounty(e.target.value);
                    setSelectedMunicipality("");
                  }}
                >
                  {counties.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </label>

              {/* Municipality */}
              <label>
                Bashkia:
                <select
                  value={selectedMunicipality}
                  disabled={!selectedCounty}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                >
                  {municipalities.map((m) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </label>

            </div>
          )}

          {showNav && (
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

export default Navbar;
