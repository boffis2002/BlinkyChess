import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then((result) => {
        if (!cancelled) setUsername(result.username);
      })
      .catch(() => {
        if (!cancelled) setUsername(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (loginUsername, password) => {
    const user = await api.login(loginUsername, password);
    setUsername(user.username);
  }, []);

  const register = useCallback(async (newUsername, password, confirmPassword) => {
    if (password !== confirmPassword) {
      throw new Error('The two passwords do not match');
    }
    if (newUsername.includes(' ') || newUsername === '' || password === '' || password.includes(' ')) {
      throw new Error('Username or password not valid, dont put spaces or blank boxes');
    }
    const user = await api.register(newUsername, password);
    setUsername(user.username);
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ username, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
