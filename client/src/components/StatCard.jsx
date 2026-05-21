const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  red: 'bg-red-50 border-red-200 text-red-700',
};

export default function StatCard({ title, value, color = 'blue' }) {
  const colorClass = colorClasses[color];

  return (
    <div className={`border rounded-lg p-6 ${colorClass}`}>
      <p className="text-sm font-semibold opacity-75 mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
