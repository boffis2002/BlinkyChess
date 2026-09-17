import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ homeIcon = '/images/casabianca.png', accountIcon = '/images/account.png', title }) {
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
        <Link className="icon" to="/"><img src={homeIcon} alt="" /></Link>
        <div className="dropdown" ref={dropdownRef}>
          <a className="icon" onClick={() => setMenuOpen((open) => !open)}><img src={accountIcon} alt="" /></a>
          <div className={`dropdown-content${menuOpen ? ' open' : ''}`}>
            <Link to={username ? `/profile/${username}` : '/login'} onClick={() => setMenuOpen(false)}>Profile</Link>
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
