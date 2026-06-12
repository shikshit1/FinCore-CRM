const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-900/60 dark:text-blue-300',
  green: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/50 dark:border-green-900/60 dark:text-green-300',
  purple: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/50 dark:border-purple-900/60 dark:text-purple-300',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-900/60 dark:text-indigo-300',
  red: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/50 dark:border-red-900/60 dark:text-red-300',
};

export default function StatCard({ title, value, color = 'blue' }) {
  const colorClass = colorClasses[color];

  return (
    <div className={`border rounded-xl p-6 transition-colors duration-300 ${colorClass}`}>
      <p className="text-sm font-semibold opacity-75 mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
