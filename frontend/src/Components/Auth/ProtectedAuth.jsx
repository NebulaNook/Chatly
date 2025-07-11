import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
