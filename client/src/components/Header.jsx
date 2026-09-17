import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function Header() {
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
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true">♞</span>
        <span className="brand-name">BlinkyChess</span>
      </Link>
      <div id="header-right">
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
