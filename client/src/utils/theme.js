/** Shared Tailwind class groups for consistent light/dark styling */

export const pageShell = 'flex h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300';
export const pageMain = 'flex-1 flex flex-col overflow-hidden';
export const pageContent = 'flex-1 overflow-auto';

export const card =
  'bg-white dark:bg-slate-900/90 dark:backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300';
export const cardHover = `${card} hover:shadow-md dark:hover:shadow-slate-950/40`;

export const heading = 'text-gray-900 dark:text-slate-100';
export const subtext = 'text-gray-500 dark:text-slate-400';
export const bodyText = 'text-gray-600 dark:text-slate-300';

export const input =
  'w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors duration-200';

export const select = input;

export const tableWrap = `${card} overflow-hidden`;
export const tableHead = 'bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700';
export const tableRow = 'border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors';
export const th = 'px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300';
export const td = 'px-6 py-4 text-sm text-gray-600 dark:text-slate-300';

export const alertError =
  'p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg';
export const alertSuccess =
  'p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-300 rounded-lg';

export const btnPrimary =
  'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200';
export const btnSecondary =
  'border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200';
