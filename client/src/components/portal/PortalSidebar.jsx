import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, FolderOpen, Landmark } from 'lucide-react';

const nav = [
  { path: '/customer/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/customer/loans', label: 'My Loans', Icon: FileText },
  { path: '/customer/documents', label: 'Documents', Icon: FolderOpen },
  { path: '/customer/profile', label: 'Profile', Icon: User },
];

export default function PortalSidebar() {
  const location = useLocation();

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-800 to-blue-900 dark:from-slate-900 dark:to-slate-950 text-white flex-col z-40 shadow-xl border-r border-transparent dark:border-slate-800 transition-colors duration-300">
        <div className="p-5 border-b border-white/10 dark:border-slate-700/80">
          <div className="flex items-center gap-2">
            <Landmark className="w-8 h-8 text-blue-200 dark:text-blue-400" />
            <div>
              <p className="font-bold">FinCore</p>
              <p className="text-xs text-blue-200 dark:text-slate-400">Customer Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ path, label, Icon }) => {
            const active = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-white/15 dark:bg-slate-800 text-white'
                    : 'text-blue-100 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-indigo-900 dark:bg-slate-950 text-white flex justify-around py-2 z-40 border-t border-white/10 dark:border-slate-800 transition-colors duration-300">
        {nav.map(({ path, label, Icon }) => {
          const active = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${
                active ? 'text-white' : 'text-blue-200 dark:text-slate-500'
              }`}
            >
              <Icon size={20} />
              {label.split(' ')[0]}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
