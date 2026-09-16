import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ homeIcon = '/images/casabianca.png', accountIcon = '/images/account.png', title }) {
  const { username, logout } = useAuth();

  return (
    <header id="header-index">
      {title && <h1 className="titolo">{title}</h1>}
      <div id="header-right">
        <Link className="icon" to="/"><img src={homeIcon} alt="" /></Link>
        <div className="dropdown">
          <a className="icon"><img src={accountIcon} alt="" /></a>
          <div className="dropdown-content">
            <Link to={username ? `/profile/${username}` : '/login'}>Profile</Link>
            <Link to="/login" onClick={logout}>Logout</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
