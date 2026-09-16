import { createContext, useCallback, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => sessionStorage.getItem('username'));

  const login = useCallback(async (loginUsername, password) => {
    const user = await api.getUser(loginUsername);
    if (password !== user.password) {
      throw new Error('password is wrong, try again');
    }
    sessionStorage.clear();
    sessionStorage.setItem('username', loginUsername);
    sessionStorage.setItem('password', password);
    setUsername(loginUsername);
  }, []);

  const register = useCallback(async (newUsername, password, confirmPassword) => {
    if (password !== confirmPassword) {
      throw new Error('The two passwords do not match');
    }
    if (newUsername.includes(' ') || newUsername === '' || password === '' || password.includes(' ')) {
      throw new Error('Username or password not valid, dont put spaces or blank boxes');
    }
    const user = await api.addUser({ username: newUsername, password });
    if (!user) {
      throw new Error('username already taken, choose another name');
    }
    sessionStorage.clear();
    sessionStorage.setItem('username', newUsername);
    sessionStorage.setItem('password', password);
    setUsername(newUsername);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUsername(null);
  }, []);

  const checkStorage = useCallback(async () => {
    const storedUsername = sessionStorage.getItem('username');
    const storedPassword = sessionStorage.getItem('password');
    sessionStorage.removeItem('id');
    if (!storedUsername) {
      sessionStorage.clear();
      setUsername(null);
      return false;
    }
    try {
      const user = await api.getUser(storedUsername);
      if (storedPassword !== user.password) {
        sessionStorage.clear();
        setUsername(null);
        return false;
      }
      return true;
    } catch {
      sessionStorage.clear();
      setUsername(null);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ username, login, register, logout, checkStorage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
