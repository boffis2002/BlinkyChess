import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { checkStorage } = useAuth();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    checkStorage().then((ok) => {
      if (!cancelled) setStatus(ok ? 'ok' : 'denied');
    });
    return () => {
      cancelled = true;
    };
  }, [checkStorage]);

  if (status === 'checking') return null;
  if (status === 'denied') return <Navigate to="/login" replace />;
  return children;
}
