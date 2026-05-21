import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-blue-700' : '';
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/loans', label: 'Loans', icon: '📋' },
    { path: '/banks', label: 'Banks', icon: '🏦' },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/call-tracking', label: 'Call Tracking', icon: '📞' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-blue-600 text-white shadow-lg">
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-2xl font-bold">FinCore</h1>
        <p className="text-blue-200 text-sm">CRM System</p>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-6 py-3 hover:bg-blue-700 transition ${isActive(item.path)}`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
