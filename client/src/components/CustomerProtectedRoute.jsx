import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from './Loading';
import { isCustomer } from '../utils/roles';

export default function CustomerProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!token) return <Navigate to="/login" replace />;
  if (user && !isCustomer(user)) return <Navigate to="/dashboard" replace />;

  return children;
}
