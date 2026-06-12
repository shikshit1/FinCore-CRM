export default function AuthInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
  autoComplete,
}) {
  return (
    <div className="group">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500
            transition-all duration-200 ease-out
            hover:border-gray-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-800
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:shadow-md dark:focus:shadow-blue-500/10`}
        />
      </div>
    </div>
  );
}
