import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="main-account">
      <div className="div-login">
        <h1>Login</h1>
        <div className="inputbox">
          <input
            id="username"
            className="user-log"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="inputbox">
          <input
            id="password"
            className="psw-log"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-submit" onClick={handleLogin}>Login</button>
        <div className="register-link1">
          <p>Don't you have an account yet? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </main>
  );
}
