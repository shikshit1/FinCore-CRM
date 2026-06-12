import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { isAdmin, isCustomer } from '../utils/roles';

/** Admin-only CRM routes (employee management, etc.) */
export default function AdminProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!token) return <Navigate to="/login" replace />;
  if (isCustomer(user)) return <Navigate to="/customer/dashboard" replace />;
  if (!isAdmin(user)) return <Navigate to="/dashboard" replace />;

  return children;
}
