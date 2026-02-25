import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="st-navbar">
      <div className="st-navbar__logo">
        <span className="st-navbar__logo-main">Stranger</span>
        <span className="st-navbar__logo-sub">Things</span>
      </div>

      <ul className="st-navbar__menu">
        <li className="st-navbar__item">Home</li>
        <li className="st-navbar__item">Characters</li>
        <li className="st-navbar__item">Upside Down</li>
        <li className="st-navbar__item">Gate</li>
      </ul>
    </nav>
  )
}

export default Navbar

