import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-slate-900/95 dark:backdrop-blur-md shadow dark:shadow-slate-950/50 border-b border-transparent dark:border-slate-800 transition-colors duration-300">
      <div className="px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-slate-100">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600 dark:text-slate-400 text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user?.email}</p>
            <p className="text-xs text-gray-600 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
