import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import ThemeToggle from './ThemeToggle';
import { Menu, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggle } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-white dark:bg-slate-900/95 dark:backdrop-blur-md shadow-sm dark:shadow-slate-950/50 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={toggle}
            className="md:hidden p-2 -ml-1 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-slate-100">
            Welcome, {user?.name}
          </h2>
            <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm hidden sm:block">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <ThemeToggle />
          <div className="hidden md:block text-right">
<p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user?.email}</p>           
 <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          <div className="md:hidden text-right">
            <p className="text-xs font-medium text-gray-700 dark:text-slate-300 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-1.5"
          >
            <LogOut size={16} className="sm:hidden" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
