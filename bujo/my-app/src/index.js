import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './navigation.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  }

  const handleCloseClick = () => {
    setIsMenuOpen(false);
  }

  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <a href="login.html">
              <img className="navIcon" src="ravenicon.png" alt="Icon" />
            </a>
            <a className="navbar-brand" href="login.html">Raven BuJo</a>
          </div>
          <div className={` navbar-nav sidenav nav-menu ${isMenuOpen ? 'nav-menu--open' : ''}`} id="navMenu">
            <div className="hidden closebtn navbar-nav" onClick={handleCloseClick}>
              <span className="material-symbols-outlined">close</span>
            </div>
            <a className="nav-link active" href="index.js">Lists</a>
            <a className="nav-link" href="./Settings.js">Settings</a>
          </div>
          <div className="hidden openbtn" onClick={handleMenuClick}>
            <span className="material-symbols-outlined">menu</span>
          </div>
          {isMenuOpen && <div className="overlay overlay--visible"></div>}
        </div>
      </nav>
    </header>
  )
}

root.render(
  <React.StrictMode>
    <>
      <Navigation />
      <App />
    </>
  </React.StrictMode>
);
