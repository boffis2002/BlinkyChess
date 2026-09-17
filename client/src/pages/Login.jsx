import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function Login() {
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
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
        <Button variant="primary" className="login-submit" loading={loading} onClick={handleLogin}>
          Login
        </Button>
        <div className="register-link1">
          <p>Don't you have an account yet? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </main>
  );
}
