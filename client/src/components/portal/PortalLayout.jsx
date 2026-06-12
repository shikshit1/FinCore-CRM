import { useNavigate } from 'react-router-dom';
import PortalSidebar from './PortalSidebar';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function PortalLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <PortalSidebar />
      <div className="lg:pl-64">
        <header className="bg-white/80 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-3">
            <div>
              {title && <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <User size={16} className="text-blue-600 dark:text-blue-400" />
                {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
