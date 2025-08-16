import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { IoMoonOutline } from "react-icons/io5";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import { IoSunnyOutline } from "react-icons/io5";



const Navbar = () => {
  const [showNav, setShowNav] = useState(window.innerWidth < 600 ? false : true);
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem('elektoral-theme') === 'dark'
  );

  // function to close the nav menu on small screens
  const closeNavMenu = () => {
    if (window.innerWidth < 600) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
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
        <Link to ="/" className="nav__logo"> elektorAL </Link>
        <div>

          {showNav && <menu>
            <NavLink to ="/elections" onClick={closeNavMenu}>Zgjedhje</NavLink>
            <NavLink to ="/results" onClick={closeNavMenu}>Rezultate</NavLink>
            <NavLink to ="/logout" onClick={closeNavMenu}>Log out</NavLink>
          </menu> }

           <button className="theme__toggle-btn" onClick={changeThemeHandler}>
      {darkTheme ? <IoSunnyOutline /> : <IoMoonOutline /> }
    </button>
          <button className="nav__toggle-btn" onClick={() => setShowNav(!showNav)}> 
            {showNav ? <AiOutlineClose/> : <HiOutlineBars3/> }</button>


        </div>
        </div>
    </nav>
  )
}

export default Navbar