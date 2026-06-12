import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300
        bg-gray-100 border-gray-200 text-gray-700 dark:text-slate-300 hover:bg-gray-200
        dark:bg-slate-800 dark:border-slate-700 dark:text-amber-300 dark:hover:bg-slate-700
        ${className}`}
    >
      <Sun
        className={`w-5 h-5 absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <Moon
        className={`w-5 h-5 absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      />
      <span className="sr-only">Current theme: {theme}</span>
    </button>
  );
}
