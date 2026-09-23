import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Login() {
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setHasError(false);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setHasError(true);
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="main-account">
        <div className="div-login">
          <h1>Login</h1>
          <div className="inputbox">
            <input
              id="username"
              className={`user-log${hasError ? ' input-error' : ''}`}
              placeholder="Username"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setHasError(false);
              }}
            />
          </div>
          <div className="inputbox">
            <input
              id="password"
              className={`psw-log${hasError ? ' input-error' : ''}`}
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setHasError(false);
              }}
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
      <Footer />
    </>
  );
}
