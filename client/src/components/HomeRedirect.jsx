import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { getHomePath } from '../utils/roles';

export default function HomeRedirect() {
  const { user, token, loading } = useAuth();

  if (loading) return <Loading />;
  if (!token) return <Navigate to="/" replace />;
  return <Navigate to={getHomePath(user)} replace />;
}
