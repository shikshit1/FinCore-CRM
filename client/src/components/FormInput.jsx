const fieldClass =
  'w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-500/30 transition-colors duration-200';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  options = null,
  rows = null,
}) {
  const labelClass = 'block text-gray-700 dark:text-slate-300 font-semibold mb-2';

  if (type === 'select' && options) {
    return (
      <div className="mb-4">
        <label className={labelClass}>{label}</label>
        <select name={name} value={value} onChange={onChange} required={required} className={fieldClass}>
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-4">
        <label className={labelClass}>{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows || 4}
          className={fieldClass}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
      />
    </div>
  );
}
