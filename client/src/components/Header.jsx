import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Inline instead of PNGs: they inherit the header's text color via
// currentColor, so the same icon works on every page/theme without needing
// separate light/dark image variants swapped in by prop.
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function Header({ title }) {
  const { username, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header id="header-index">
      {title && <h1 className="titolo">{title}</h1>}
      <div id="header-right">
        <Link className="icon" to="/" aria-label="Home">
          <HomeIcon />
        </Link>
        <div className="dropdown" ref={dropdownRef}>
          <a className="icon" aria-label="Account" onClick={() => setMenuOpen((open) => !open)}>
            <AccountIcon />
          </a>
          <div className={`dropdown-content${menuOpen ? ' open' : ''}`}>
            <Link to={username ? `/profile/${username}` : '/login'} onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <Link
              to="/login"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
