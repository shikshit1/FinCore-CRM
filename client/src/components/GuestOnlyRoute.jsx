import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { getHomePath } from '../utils/roles';

/** Login/register — redirect authenticated users to their dashboard */
export default function GuestOnlyRoute({ children }) {
  const { token, user, loading } = useAuth();

  if (loading) return <Loading />;
  if (token && user) return <Navigate to={getHomePath(user)} replace />;

  return children;
}
