import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  name = 'password',
  value,
  onChange,
  placeholder = 'Enter your password',
  required = true,
  autoComplete = 'current-password',
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="group">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200 pointer-events-none">
          <Lock className="w-5 h-5" />
        </div>
        <input
          id={name}
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full pl-11 pr-12 py-3 bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500
            transition-all duration-200 ease-out
            hover:border-gray-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-800
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:shadow-md dark:focus:shadow-blue-500/10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
