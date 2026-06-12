export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="text-center">
        <div className="inline-block animate-spin">
          <div className="h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full" />
        </div>
        <p className="mt-4 text-gray-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
