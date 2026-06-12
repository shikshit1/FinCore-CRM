import { useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Landmark, Menu, X } from 'lucide-react';

import ThemeToggle from '../ThemeToggle';



const links = [

  { hash: 'home', label: 'Home' },

  { hash: 'loans', label: 'Loans' },

  { hash: 'emi', label: 'EMI Info' },

  { hash: 'about', label: 'About' },

  { hash: 'faq', label: 'FAQ' },

  { hash: 'contact', label: 'Contact' },

];



export default function PublicNavbar({ onApplyClick }) {

  const [open, setOpen] = useState(false);

  const location = useLocation();



  const sectionLink = (hash) => {

    if (location.pathname === '/') return `#${hash}`;

    return `/#${hash}`;

  };



  return (

    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">

              <Landmark className="w-5 h-5 text-white" />

            </div>

            <span className="font-bold text-gray-900 dark:text-slate-100">FinCore</span>

          </Link>



          <div className="hidden lg:flex items-center gap-5">

            {links.map((l) => (

              <a

                key={l.hash}

                href={sectionLink(l.hash)}

                className="text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"

              >

                {l.label}

              </a>

            ))}

          </div>



          <div className="hidden lg:flex items-center gap-3">

            <ThemeToggle />

            <Link

              to="/login"

              className="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-blue-600 px-3 py-2"

            >

              Login

            </Link>

            <Link

              to="/register"

              className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-lg transition shadow-sm"

            >

              Register

            </Link>

            {onApplyClick ? (

              <button

                type="button"

                onClick={onApplyClick}

                className="text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"

              >

                Apply Loan

              </button>

            ) : (

              <Link

                to="/apply"

                className="text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"

              >

                Apply Loan

              </Link>

            )}

          </div>



          <div className="flex lg:hidden items-center gap-2">

            <ThemeToggle />

            <button

              type="button"

              className="p-2 text-gray-600 dark:text-slate-400"

              onClick={() => setOpen(!open)}

              aria-label="Menu"

            >

              {open ? <X size={24} /> : <Menu size={24} />}

            </button>

          </div>

        </div>

      </div>



      {open && (

        <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">

          {links.map((l) => (

            <a

              key={l.hash}

              href={sectionLink(l.hash)}

              className="block text-gray-700 dark:text-slate-300 py-1"

              onClick={() => setOpen(false)}

            >

              {l.label}

            </a>

          ))}

          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">

            <Link to="/login" className="text-center py-2.5 border rounded-lg dark:border-slate-600" onClick={() => setOpen(false)}>

              Login

            </Link>

            <Link to="/register" className="text-center py-2.5 border rounded-lg dark:border-slate-600" onClick={() => setOpen(false)}>

              Register

            </Link>

            <Link to="/apply" className="text-center py-2.5 bg-blue-600 text-white rounded-lg" onClick={() => setOpen(false)}>

              Apply Loan

            </Link>

          </div>

        </div>

      )}

    </nav>

  );

}

