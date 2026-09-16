import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import Game from './pages/Game';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Waiting from './pages/Waiting';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/profile/:username" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/waiting" element={<RequireAuth><Waiting /></RequireAuth>} />
          <Route path="/game/:id/:color" element={<RequireAuth><Game /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
