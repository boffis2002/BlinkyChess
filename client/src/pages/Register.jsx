import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    try {
      await register(username, password, confirmPassword);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="main-account">
      <div className="div-login">
        <h1>Register</h1>
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
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="inputbox">
          <input
            id="confirm-password"
            className="psw-log"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-submit" onClick={handleRegister}>Register</button>
        <div className="register-link">
          <p>Do you have an account yet? <Link to="/login">Login</Link></p>
          <div className="showPSW">
            <input
              type="checkbox"
              id="showpsw"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="showpsw">Show password</label>
          </div>
        </div>
      </div>
    </main>
  );
}
