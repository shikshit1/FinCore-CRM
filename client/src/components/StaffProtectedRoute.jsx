import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from './Loading';
import { isCustomer } from '../utils/roles';

export default function StaffProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!token) return <Navigate to="/login" replace />;
  if (isCustomer(user)) return <Navigate to="/customer/dashboard" replace />;

  return children;
}
